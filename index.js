var express = require('express');
var ejwt = require('express-jwt');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var cors = require('cors');
require('dotenv').config();
var app = express();

app.use(cors());
//app.use(cors({ origin: 'http://localhost:3000' }));

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('anything'));

app.use(
  session({
    secret: 'anything',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport');

app.use(
  ejwt({ secret: process.env.JWT_SECRET }).unless({
    path: ['/user/auth/google'],
  })
);

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.use('/group', require('./routes/group.js'));
app.use('/user', require('./routes/user.js'));
app.use('/game', require('./routes/game.js'));
app.use('/prediction', require('./routes/prediction.js'));

var port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server starts at port ${port}`);
});
