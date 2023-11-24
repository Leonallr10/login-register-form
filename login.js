const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const mysql = require('mysql2');

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '',
  database: 'telesto',
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(session({
  secret: '@Sibi#123', 
  resave: false,
  saveUninitialized: true,
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.get('/index', (req, res) => {
  if (req.session.user) {
    res.sendFile(__dirname + '/index.html');
  } else {
    res.redirect('/');
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM admin WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, result) => {
    if (err) {
      throw err;
    }

    if (result.length > 0) {
      req.session.user = {
        email: result[0].email,
        
      };
      res.redirect(`/index?email=${encodeURIComponent(result[0].email)}`);
    } else {
      res.send('Invalid login credentials. Please try again.');
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
