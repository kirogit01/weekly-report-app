const express = require('express');
const {
  getSummary,
  getTasksTrend,
  getSubmissionStatus,
  getWorkloadByProject,
  getRecentActivity,
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('manager'));

router.get('/summary', getSummary);
router.get('/charts/tasks-trend', getTasksTrend);
router.get('/charts/submission-status', getSubmissionStatus);
router.get('/charts/workload-by-project', getWorkloadByProject);
router.get('/activity', getRecentActivity);

module.exports = router;
