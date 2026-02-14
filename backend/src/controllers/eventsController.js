const pool = require('../config/database');

const getAllEvents = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM events ORDER BY event_date DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, event_date, location } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({ error: 'Title and event date are required' });
    }

    const result = await pool.query(
      `INSERT INTO events (title, description, event_date, location, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [title, description, event_date, location, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, event_date, location } = req.body;

    if (!title || !event_date) {
      return res.status(400).json({ error: 'Title and event date are required' });
    }

    const result = await pool.query(
      `UPDATE events 
       SET title = $1, description = $2, event_date = $3, location = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [title, description, event_date, location, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const checkInMember = async (req, res) => {
  try {
    const { eventId, memberId } = req.params;

    const result = await pool.query(
      `INSERT INTO attendance (event_id, member_id, checked_in_by)
       VALUES ($1, $2, $3) 
       ON CONFLICT (event_id, member_id) DO NOTHING
       RETURNING *`,
      [eventId, memberId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(409).json({ error: 'Member already checked in' });
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Check in error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getEventAttendance = async (req, res) => {
  try {
    const { eventId } = req.params;

    const result = await pool.query(
      `SELECT a.*, m.first_name, m.last_name, m.email, m.phone
       FROM attendance a
       JOIN members m ON a.member_id = m.id
       WHERE a.event_id = $1
       ORDER BY a.checked_in_at DESC`,
      [eventId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  checkInMember,
  getEventAttendance,
};
