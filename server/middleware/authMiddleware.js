const jwt = require('jsonwebtoken');
const pool = require('../db');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const result = await pool.query('SELECT id FROM users WHERE id = $1', [user.userId]);
    if (result.rows.length === 0) return res.sendStatus(403);

    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.sendStatus(403);
  }
};

module.exports = authenticateToken;
