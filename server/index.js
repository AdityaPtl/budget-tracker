const authRoutes = require('./routes/auth');

// 1. Import core packages
const express = require('express');            // Framework for building web servers and APIs
const cors = require('cors');                  // Middleware to allow frontend access (Cross-Origin)
require('dotenv').config();                    // Loads variables from .env (like DB credentials)
const pool = require('./db');                  // PostgreSQL connection pool from db.js

// 2. Create the Express app
const app = express();

// 3. Apply middleware
app.use(cors());                               // Allows frontend (on a different port) to access API
app.use(express.json());                       // Allows server to parse incoming JSON requests

app.use('/api/auth', authRoutes);

const transactionRoutes = require('./routes/transactions');
app.use('/api/transactions', transactionRoutes);

app.get('/ping', (req, res) => {
    res.send('pong');
  });

// 4. Test route to check DB connection and server status
app.get('/', async (req, res) => {
    console.log('GET / called');  // Debug line
    try {
      const result = await pool.query('SELECT NOW()');
      res.send(`API running. DB time: ${result.rows[0].now}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Database connection error');
    }
  });

// 5. Start the server
const PORT = process.env.PORT || 5050;         // Use .env PORT if provided, else default to 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

