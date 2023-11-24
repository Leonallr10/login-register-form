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

// ... (your existing code)

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'forgot_password.html'));
  });

app.post('/forgot_password', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirm_password = req.body.confirm_password;
  
    if (!email || !password || !confirm_password) {
      return res.status(400).json({ error: 'Email, password, and confirm password are required' });
    }
  
    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Password and confirm password do not match' });
    }
  
    const checkQuery = 'SELECT email FROM admin WHERE email = ?';
    const updateQuery = 'UPDATE admin SET password = ? WHERE email = ?';
  
    try {
      const connection = await pool.getConnection();
  
      const [checkRows, checkFields] = await connection.execute(checkQuery, [email]);
  
      if (checkRows.length === 0) {
        connection.release();
        return res.status(404).json({ error: 'Email not found in the database' });
      }
      const [updateRows, updateFields] = await connection.execute(updateQuery, [password, email]);
  
      connection.release();
      console.log("Password updated successfully");
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: err.message });
    }
  });
  