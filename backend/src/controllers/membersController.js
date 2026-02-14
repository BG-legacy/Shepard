const pool = require('../config/database');

const getAllMembers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM members ORDER BY last_name, first_name'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM members WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const createMember = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, address, birth_date, join_date, notes } = req.body;

    if (!first_name || !last_name || !email || !phone) {
      return res.status(400).json({ error: 'First name, last name, email, and phone are required' });
    }

    const result = await pool.query(
      `INSERT INTO members (first_name, last_name, email, phone, address, birth_date, join_date, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [first_name, last_name, email, phone, address, birth_date, join_date, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, phone, address, birth_date, join_date, notes } = req.body;

    if (!first_name || !last_name || !email || !phone) {
      return res.status(400).json({ error: 'First name, last name, email, and phone are required' });
    }

    const result = await pool.query(
      `UPDATE members 
       SET first_name = $1, last_name = $2, email = $3, phone = $4, 
           address = $5, birth_date = $6, join_date = $7, notes = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 RETURNING *`,
      [first_name, last_name, email, phone, address, birth_date, join_date, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM members WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMembersNotSeenRecently = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members_not_seen_recently ORDER BY last_name, first_name');
    res.json(result.rows);
  } catch (error) {
    console.error('Get members not seen recently error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  getMembersNotSeenRecently,
};
