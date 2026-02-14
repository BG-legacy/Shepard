const express = require('express');
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  checkInMember,
  getEventAttendance,
} = require('../controllers/eventsController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getAllEvents);
router.get('/:id', auth, getEventById);
router.post('/', auth, authorize('admin', 'leader'), createEvent);
router.put('/:id', auth, authorize('admin', 'leader'), updateEvent);
router.delete('/:id', auth, authorize('admin'), deleteEvent);
router.post('/:eventId/checkin/:memberId', auth, checkInMember);
router.get('/:eventId/attendance', auth, getEventAttendance);

module.exports = router;
