const express = require('express');
const router = express.Router();
const {
  generateInsight,
  getInsightsByMember,
} = require('../controllers/insightsController');
const { auth, authorize } = require('../middleware/auth');

router.post('/member/:memberId', auth, authorize('admin', 'leader'), generateInsight);
router.get('/member/:memberId', auth, getInsightsByMember);

module.exports = router;
