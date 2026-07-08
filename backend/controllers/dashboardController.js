const mongoose = require('mongoose');
const Report = require('../models/Report');
const User = require('../models/User');

// @route GET /api/dashboard/summary?week=YYYY-MM-DD  (manager only)
const getSummary = async (req, res) => {
  try {
    const { week } = req.query;
    const weekStart = week ? new Date(week) : null;

    const memberFilter = { role: 'member', isActive: true };
    const totalMembers = await User.countDocuments(memberFilter);

    const reportFilter = weekStart ? { weekStartDate: weekStart } : {};
    const reports = await Report.find(reportFilter);

    const submittedCount = reports.filter((r) => r.status === 'submitted').length;
    const pendingCount = Math.max(totalMembers - submittedCount, 0);
    const complianceRate = totalMembers > 0 ? Math.round((submittedCount / totalMembers) * 100) : 0;

    const openBlockers = reports.filter((r) => r.blockers && r.blockers.trim().length > 0).length;

    res.json({
      totalMembers,
      totalReportsSubmitted: submittedCount,
      pendingCount,
      complianceRate,
      openBlockers,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch summary', error: err.message });
  }
};

// @route GET /api/dashboard/charts/tasks-trend  (manager only)
// Number of submitted reports per week — a proxy for task-completion activity over time.
const getTasksTrend = async (req, res) => {
  try {
    const trend = await Report.aggregate([
      { $match: { status: 'submitted' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$weekStartDate' } },
          reportsSubmitted: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(trend.map((t) => ({ week: t._id, reportsSubmitted: t.reportsSubmitted })));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks trend', error: err.message });
  }
};

// @route GET /api/dashboard/charts/submission-status?week=YYYY-MM-DD  (manager only)
const getSubmissionStatus = async (req, res) => {
  try {
    const { week } = req.query;
    const weekStart = week ? new Date(week) : null;

    const members = await User.find({ role: 'member', isActive: true }).select('name');
    const reportFilter = weekStart ? { weekStartDate: weekStart } : {};
    const reports = await Report.find(reportFilter).select('user status');

    const reportByUser = new Map(reports.map((r) => [r.user.toString(), r.status]));

    const result = members.map((m) => ({
      member: m.name,
      status: reportByUser.get(m._id.toString()) || 'pending',
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch submission status', error: err.message });
  }
};

// @route GET /api/dashboard/charts/workload-by-project  (manager only)
const getWorkloadByProject = async (req, res) => {
  try {
    const workload = await Report.aggregate([
      { $match: { status: 'submitted' } },
      {
        $group: {
          _id: '$project',
          totalHours: { $sum: { $ifNull: ['$hoursWorked', 0] } },
          reportCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: '_id',
          foreignField: '_id',
          as: 'projectInfo',
        },
      },
      { $unwind: '$projectInfo' },
      {
        $project: {
          _id: 0,
          project: '$projectInfo.name',
          totalHours: 1,
          reportCount: 1,
        },
      },
      { $sort: { totalHours: -1 } },
    ]);

    res.json(workload);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch workload distribution', error: err.message });
  }
};

// @route GET /api/dashboard/activity  (manager only) — recent report activity feed
const getRecentActivity = async (req, res) => {
  try {
    const recent = await Report.find({ status: 'submitted' })
      .populate('user', 'name')
      .populate('project', 'name')
      .sort({ submittedAt: -1 })
      .limit(10);

    res.json(recent);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recent activity', error: err.message });
  }
};

module.exports = {
  getSummary,
  getTasksTrend,
  getSubmissionStatus,
  getWorkloadByProject,
  getRecentActivity,
};
