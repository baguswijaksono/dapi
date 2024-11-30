const express = require('express');
const mysql = require('mysql');
const app = express();

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',      // Replace with your MySQL host
  user: 'skibidi',  // Replace with your MySQL username
  password: 'skibidi', // Replace with your MySQL password
  connectionLimit: 10,
});

// Middleware to parse query strings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to execute a query
app.get('/query', (req, res) => {
  const { db, sql } = req.query;

  // Validation
  if (!db || !sql) {
    return res.status(400).json({ error: 'Missing required parameters: db and sql' });
  }

  // Switch to the specified database
  pool.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: 'Database connection error', details: err });

    connection.changeUser({ database: db }, (err) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: 'Failed to switch database', details: err });
      }

      // Execute the query
      connection.query(sql, (err, results) => {
        connection.release();
        if (err) {
          return res.status(400).json({ error: 'Query execution failed', details: err });
        }
        res.json({ results });
      });
    });
  });
});

// Basic server setup
const PORT = 3001; // Specify your desired port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
