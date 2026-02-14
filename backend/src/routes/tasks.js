const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTasksByMember,
  createTask,
  updateTask,
  deleteTask,
  getNotesByMember,
  createNote,
} = require('../controllers/tasksController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getAllTasks);
router.get('/member/:memberId', auth, getTasksByMember);
router.post('/', auth, authorize('admin', 'leader'), createTask);
router.put('/:id', auth, authorize('admin', 'leader'), updateTask);
router.delete('/:id', auth, authorize('admin'), deleteTask);

router.get('/notes/member/:memberId', auth, getNotesByMember);
router.post('/notes', auth, createNote);

module.exports = router;
