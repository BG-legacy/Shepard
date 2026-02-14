const pool = require('../config/database');

const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, m.first_name, m.last_name, u.email as assigned_to_email
       FROM care_tasks t
       LEFT JOIN members m ON t.member_id = m.id
       LEFT JOIN users u ON t.assigned_to = u.id
       ORDER BY t.created_at DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getTasksByMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const result = await pool.query(
      `SELECT t.*, u.email as assigned_to_email
       FROM care_tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.member_id = $1
       ORDER BY t.created_at DESC`,
      [memberId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get tasks by member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createTask = async (req, res) => {
  try {
    const { member_id, title, description, status, priority, assigned_to, due_date } = req.body;

    if (!member_id || !title || !status) {
      return res.status(400).json({ error: 'Member ID, title, and status are required' });
    }

    const result = await pool.query(
      `INSERT INTO care_tasks (member_id, title, description, status, priority, assigned_to, due_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [member_id, title, description, status, priority, assigned_to, due_date, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, assigned_to, due_date } = req.body;

    if (!title || !status) {
      return res.status(400).json({ error: 'Title and status are required' });
    }

    const result = await pool.query(
      `UPDATE care_tasks 
       SET title = $1, description = $2, status = $3, priority = $4, 
           assigned_to = $5, due_date = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [title, description, status, priority, assigned_to, due_date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM care_tasks WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getNotesByMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const result = await pool.query(
      `SELECT n.*, u.email as created_by_email
       FROM care_notes n
       LEFT JOIN users u ON n.created_by = u.id
       WHERE n.member_id = $1
       ORDER BY n.created_at DESC`,
      [memberId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createNote = async (req, res) => {
  try {
    const { member_id, task_id, note } = req.body;

    if (!member_id || !note) {
      return res.status(400).json({ error: 'Member ID and note are required' });
    }

    const result = await pool.query(
      `INSERT INTO care_notes (member_id, task_id, note, created_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [member_id, task_id, note, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllTasks,
  getTasksByMember,
  createTask,
  updateTask,
  deleteTask,
  getNotesByMember,
  createNote,
};
