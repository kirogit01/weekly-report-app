const Project = require('../models/Project');

// @route GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ isActive: true })
      .populate('members', 'name email')
      .sort({ name: 1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch projects', error: err.message });
  }
};

// @route POST /api/projects (manager only)
const createProject = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name is required' });

    const existing = await Project.findOne({ name });
    if (existing) return res.status(409).json({ message: 'A project with this name already exists' });

    const project = await Project.create({
      name,
      description,
      members: members || [],
      createdBy: req.user._id,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create project', error: err.message });
  }
};

// @route PUT /api/projects/:id (manager only)
const updateProject = async (req, res) => {
  try {
    const { name, description, members, isActive } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (members !== undefined) project.members = members;
    if (isActive !== undefined) project.isActive = isActive;

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update project', error: err.message });
  }
};

// @route DELETE /api/projects/:id (manager only) — soft delete
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project.isActive = false;
    await project.save();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete project', error: err.message });
  }
};

module.exports = { getProjects, createProject, updateProject, deleteProject };
