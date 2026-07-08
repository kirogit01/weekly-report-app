const express = require('express');
const {
  createReport,
  getMyReports,
  updateReport,
  getTeamReports,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/', createReport);
router.get('/mine', getMyReports);
router.put('/:id', updateReport);
router.get('/team', authorize('manager'), getTeamReports);

module.exports = router;
