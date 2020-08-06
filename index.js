var express = require('express');
var passport = require('passport');
//var dotenv = require('dotenv');
require('dotenv').config();
var app = express();

// var allowCrossDomain = function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', '*');
//   res.header(
//     'Access-Control-Allow-Headers',
//     // 'Origin, X-Requested-With, Content-Type, Accept, Cache-Control',
//     '*'
//   );

//   //intercept OPTIONS method
//   if ('OPTIONS' == req.method) {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// };

// app.use(allowCrossDomain());

require('./config/passport');
//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//database3 connection
// require('./models/index.js');

// db.authenticate()
//   .then(() => console.log('Database connected....'))
//   .catch((err) => console.log(`${err}`));
// middleware
// app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World');
});

app.use('/group', require('./routes/group.js'));
app.use('/user', require('./routes/user.js'));

var port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server starts at port ${port}`);
  // console.log(process.env);
});
