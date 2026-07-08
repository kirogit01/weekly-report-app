const mongoose = require('mongoose');

// Fixed structure — identical fields/order for every user. No per-user customization allowed.
const reportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weekStartDate: { type: Date, required: true },
    weekEndDate: { type: Date, required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    tasksCompleted: { type: String, required: true, trim: true },
    tasksPlanned: { type: String, required: true, trim: true },
    blockers: { type: String, trim: true, default: '' },
    hoursWorked: { type: Number, min: 0, max: 168 },
    notes: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['draft', 'submitted'], default: 'draft' },
    submittedAt: { type: Date },
  },
  { timestamps: true }
);

// One report per user/project/week to keep the dashboard's compliance tracking meaningful
reportSchema.index({ user: 1, project: 1, weekStartDate: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema);
