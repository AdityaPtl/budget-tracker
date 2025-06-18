const pool = require('../db');

async function getUserById(id) {
  const result = await pool.query('SELECT id, email FROM users WHERE id = $1', [id]);
  return result.rows[0];
}

async function updateUserCredentials(id, newEmail, newPasswordHash) {
  const result = await pool.query(
    `UPDATE users 
     SET email = $1, password = $2 
     WHERE id = $3 
     RETURNING id, email`,
    [newEmail, newPasswordHash, id]
  );
  return result.rows[0];
}

module.exports = {
  getUserById,
  updateUserCredentials
};
