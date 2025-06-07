const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/auth');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const upload = multer({ dest: "uploads/" });

function autoAssignCategory(description) {
  if (!description) return "Other";

  const lower = description.toLowerCase();

  if (lower.includes("kfc") || lower.includes("mcdonald") || lower.includes("hungry jacks")) return "Food";
  if (lower.includes("coles") || lower.includes("woolworths") || lower.includes("aldi")) return "Groceries";
  if (lower.includes("uber") || lower.includes("opal")) return "Transport";
  if (lower.includes("netflix") || lower.includes("spotify") || lower.includes("prime")) return "Entertainment";
  if (lower.includes("telstra") || lower.includes("optus")) return "Utilities";
  if (lower.includes("gym") || lower.includes("fitness")) return "Health";
  if (lower.includes("chemist") || lower.includes("pharmacy")) return "Medical";
  if (lower.includes("amazon") || lower.includes("ebay")) return "Shopping";

  return "Other";
}

// GET transactions, optionally filtered by month
router.get('/', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
      const { month } = req.query;
  
      let result;
  
      if (month) {
        // month format: '2025-06'
        result = await pool.query(
          `SELECT * FROM transactions
           WHERE user_id = $1
           AND date_trunc('month', date) = date_trunc('month', $2::date)
           ORDER BY date DESC`,
          [userId, month]
        );
      } else {
        result = await pool.query(
          'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC',
          [userId]
        );
      }
  
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to get transactions' });
    }
  });
  
  

// POST a new transaction
router.post('/', authenticateToken, async (req, res) => {
  let { amount, type, category, description, date } = req.body;
  if (!category || category.trim() === "") {
    category = autoAssignCategory(description);
  }
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

// PUT update a transaction
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const { amount, type, category, description, date } = req.body;

  try {
    const result = await pool.query(
      `UPDATE transactions
       SET amount = $1, type = $2, category = $3, description = $4, date = $5
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [amount, type, category, description, date, id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Transaction not found or unauthorized' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// DELETE a transaction
router.delete('/:id', authenticateToken, async (req, res) => {
  const transactionId = req.params.id;
  const userId = req.user.userId;

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

// UPLOAD CSV transactions
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  
    const userId = req.user.userId;
    const results = [];
  
    fs.createReadStream(req.file.path)
      .pipe(csv({ headers: false }))  // tells csv-parser not to expect headers
      .on('data', (row) => {
        try {
          const dateParts = row[0]?.split('/');
          const date = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
          const amount = parseFloat(row[1]);
          const type = amount >= 0 ? 'income' : 'expense';
          const description = row[2] || '';
          const category = autoAssignCategory(description);
  
          results.push({
            userId,
            amount: Math.abs(amount),
            type,
            category,
            description,
            date,
          });
        } catch (err) {
          console.error('Row parse error:', err);
        }
      })
      .on('end', async () => {
        try {
          const query = `INSERT INTO transactions (user_id, amount, type, category, description, date)
                         VALUES ($1, $2, $3, $4, $5, $6)`;
  
          for (const tx of results) {
            await pool.query(query, [tx.userId, tx.amount, tx.type, tx.category, tx.description, tx.date]);
          }
  
          fs.unlinkSync(req.file.path); // clean up
          res.json({ message: `${results.length} transactions imported.` });
        } catch (err) {
          console.error('DB insert error:', err);
          res.status(500).json({ error: 'Failed to import transactions' });
        }
    });
});

module.exports = router;
