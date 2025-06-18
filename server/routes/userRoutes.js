const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

// GET current user details
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, created_at FROM users WHERE id = $1",
      [req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update user details
router.put("/update", authMiddleware, async (req, res) => {
  const { email, password } = req.body;

  try {
    const fields = [];
    const values = [];
    let index = 1;

    if (email) {
      fields.push(`email = $${index++}`);
      values.push(email);
    }

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      fields.push(`password = $${index++}`);
      values.push(hashed);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(req.user.userId);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = $${index} RETURNING id, email, created_at`,
      values
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

module.exports = router;
