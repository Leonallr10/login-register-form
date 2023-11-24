const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mysql = require('mysql2/promise');
const path = require('path');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.listen(port,'localhost', () => {
  console.log(`Server is running on port ${port}`);
});

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'telesto',
  port: 3306,
};

// Create the connection pool
const pool = mysql.createPool(dbConfig);

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname,'add_user.html'));
});
app.post('/', async (req, res) => {
  const email = req.body.email;
  const role = req.body.role;

  if (email === undefined || role === undefined) {
    return res.status(400).json({ error: 'Both email and role are required' });
  }

  const sqlQuery = 'INSERT INTO admin (email,password,role,status) VALUES (?,NULL,?,"Active")';

  try {
        const connection = await pool.getConnection();

    const [rows, fields] = await connection.execute(sqlQuery, [email, role]);

    connection.release();
console.log("member added successfully");
res.status(200).json({ message: 'User added successfully' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: err.message });
  }
});

