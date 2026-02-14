const pool = require('../config/database');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateInsight = async (req, res) => {
  try {
    const { memberId } = req.params;

    // Get member details
    const memberResult = await pool.query('SELECT * FROM members WHERE id = $1', [memberId]);
    if (memberResult.rows.length === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    const member = memberResult.rows[0];

    // Get attendance history
    const attendanceResult = await pool.query(
      `SELECT e.title, e.event_date, a.checked_in_at
       FROM attendance a
       JOIN events e ON a.event_id = e.id
       WHERE a.member_id = $1
       ORDER BY a.checked_in_at DESC
       LIMIT 10`,
      [memberId]
    );

    // Get care tasks
    const tasksResult = await pool.query(
      `SELECT title, description, status, priority, created_at
       FROM care_tasks
       WHERE member_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [memberId]
    );

    // Get care notes
    const notesResult = await pool.query(
      `SELECT note, created_at
       FROM care_notes
       WHERE member_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [memberId]
    );

    // Build context for AI
    const context = `
Member Profile:
- Name: ${member.first_name} ${member.last_name}
- Email: ${member.email}
- Phone: ${member.phone}
- Join Date: ${member.join_date || 'Not specified'}
- Notes: ${member.notes || 'None'}

Recent Attendance (Last 10):
${attendanceResult.rows.map(a => `- ${a.title} on ${new Date(a.checked_in_at).toLocaleDateString()}`).join('\n') || 'No recent attendance'}

Care Tasks (Last 10):
${tasksResult.rows.map(t => `- [${t.status}] ${t.title}: ${t.description || 'No description'}`).join('\n') || 'No tasks'}

Care Notes (Last 10):
${notesResult.rows.map(n => `- ${n.note} (${new Date(n.created_at).toLocaleDateString()})`).join('\n') || 'No notes'}
    `.trim();

    // Generate insight using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a caring church pastoral assistant. Analyze the member information and provide thoughtful insights about their engagement, needs, and suggestions for care. Be compassionate and practical.'
        },
        {
          role: 'user',
          content: `Based on the following member information, provide insights and care recommendations:\n\n${context}`
        }
      ],
      max_tokens: 500,
    });

    const insight = completion.choices[0].message.content;

    // Save the insight
    const saveResult = await pool.query(
      'INSERT INTO ai_insights (member_id, insight, generated_by) VALUES ($1, $2, $3) RETURNING *',
      [memberId, insight, req.user.id]
    );

    res.json(saveResult.rows[0]);
  } catch (error) {
    console.error('Generate insight error:', error);
    if (error.response?.status === 401) {
      return res.status(500).json({ error: 'OpenAI API key not configured or invalid' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

const getInsightsByMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const result = await pool.query(
      `SELECT i.*, u.email as generated_by_email
       FROM ai_insights i
       LEFT JOIN users u ON i.generated_by = u.id
       WHERE i.member_id = $1
       ORDER BY i.created_at DESC`,
      [memberId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Get insights error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  generateInsight,
  getInsightsByMember,
};
