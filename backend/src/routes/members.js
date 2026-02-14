const express = require('express');
const router = express.Router();
const {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getMembersNotSeenRecently,
} = require('../controllers/membersController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getAllMembers);
router.get('/not-seen-recently', auth, getMembersNotSeenRecently);
router.get('/:id', auth, getMemberById);
router.post('/', auth, authorize('admin', 'leader'), createMember);
router.put('/:id', auth, authorize('admin', 'leader'), updateMember);
router.delete('/:id', auth, authorize('admin'), deleteMember);

module.exports = router;
