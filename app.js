const express = require('express');
const mysql = require('mysql');
const { Pool: PgPool } = require('pg'); // PostgreSQL client
const sqlite3 = require('sqlite3').verbose(); // SQLite client
const mongoose = require('mongoose'); // MongoDB client

const app = express();

// MySQL connection pool
const mysqlPool = mysql.createPool({
  host: 'localhost',
  user: 'skibidi',
  password: 'skibidi',
  connectionLimit: 10,
});

// PostgreSQL connection pool
const pgPool = new PgPool({
  host: 'localhost',
  user: 'postgres',
  password: 'postgres',
  max: 10,
});

// MongoDB connection (assumes you are connecting to a local database)
mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware to parse query strings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint to execute a query
app.get('/query', async (req, res) => {
  const { db, sql, dbType } = req.query;

  // Validation
  if (!db || !sql || !dbType) {
    return res
      .status(400)
      .json({ error: 'Missing required parameters: db, sql, and dbType' });
  }

  try {
    if (dbType === 'mysql') {
      // MySQL
      mysqlPool.getConnection((err, connection) => {
        if (err) throw err;

        connection.changeUser({ database: db }, (err) => {
          if (err) {
            connection.release();
            throw err;
          }

          connection.query(sql, (err, results) => {
            connection.release();
            if (err) throw err;
            res.json({ results });
          });
        });
      });
    } else if (dbType === 'postgres') {
      // PostgreSQL
      const client = await pgPool.connect();
      try {
        client.query(`SET search_path TO ${db};`);
        const results = await client.query(sql);
        res.json({ results: results.rows });
      } finally {
        client.release();
      }
    } else if (dbType === 'sqlite') {
      // SQLite
      const dbConnection = new sqlite3.Database(`${db}.sqlite`, (err) => {
        if (err) throw err;
      });

      dbConnection.all(sql, [], (err, rows) => {
        dbConnection.close();
        if (err) throw err;
        res.json({ results: rows });
      });
    } else if (dbType === 'mongodb') {
      // MongoDB
      const dbConnection = mongoose.connection.useDb(db);
      const result = await dbConnection.command({ eval: sql });
      res.json({ results: result });
    } else {
      res.status(400).json({ error: 'Unsupported dbType' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Database query error', details: err.message });
  }
});

// Basic server setup
const PORT = 3001; // Specify your desired port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
