const Report = require('../models/Report');

// @route POST /api/reports  (team member)
const createReport = async (req, res) => {
  try {
    const {
      weekStartDate,
      weekEndDate,
      project,
      tasksCompleted,
      tasksPlanned,
      blockers,
      hoursWorked,
      notes,
      status,
    } = req.body;

    if (!weekStartDate || !weekEndDate || !project || !tasksCompleted || !tasksPlanned) {
      return res.status(400).json({ message: 'Missing required report fields' });
    }

    const report = await Report.create({
      user: req.user._id,
      weekStartDate,
      weekEndDate,
      project,
      tasksCompleted,
      tasksPlanned,
      blockers,
      hoursWorked,
      notes,
      status: status === 'submitted' ? 'submitted' : 'draft',
      submittedAt: status === 'submitted' ? new Date() : undefined,
    });

    res.status(201).json(report);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'A report for this project and week already exists' });
    }
    res.status(500).json({ message: 'Failed to create report', error: err.message });
  }
};

// @route GET /api/reports/mine  (team member — own history)
const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id })
      .populate('project', 'name')
      .sort({ weekStartDate: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reports', error: err.message });
  }
};

// @route PUT /api/reports/:id  (owner only, or manager)
const updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const isOwner = report.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Not authorized to edit this report' });
    }

    const editableFields = [
      'weekStartDate', 'weekEndDate', 'project', 'tasksCompleted',
      'tasksPlanned', 'blockers', 'hoursWorked', 'notes', 'status',
    ];
    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) report[field] = req.body[field];
    });

    if (req.body.status === 'submitted' && report.status !== 'submitted') {
      report.submittedAt = new Date();
    }

    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update report', error: err.message });
  }
};

// @route GET /api/reports/team  (manager only) — filterable team view
const getTeamReports = async (req, res) => {
  try {
    const { week, member, project, dateFrom, dateTo } = req.query;
    const filter = {};

    if (member) filter.user = member;
    if (project) filter.project = project;

    if (week) {
      // "week" expected as an ISO date for the week's Monday (weekStartDate)
      filter.weekStartDate = new Date(week);
    } else if (dateFrom || dateTo) {
      filter.weekStartDate = {};
      if (dateFrom) filter.weekStartDate.$gte = new Date(dateFrom);
      if (dateTo) filter.weekStartDate.$lte = new Date(dateTo);
    }

    const reports = await Report.find(filter)
      .populate('user', 'name email')
      .populate('project', 'name')
      .sort({ weekStartDate: -1, 'user.name': 1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch team reports', error: err.message });
  }
};

module.exports = { createReport, getMyReports, updateReport, getTeamReports };
