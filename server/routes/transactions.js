const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// GET all transactions for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// POST a new transaction
router.post('/', authenticateToken, async (req, res) => {
  const { amount, type, category, description, date } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, amount, type, category, description, date)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, amount, type, category, description, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// DELETE a transaction
router.delete('/:id', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const transactionId = req.params.id;

  try {
    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *',
      [transactionId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    }

    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

module.exports = router;
