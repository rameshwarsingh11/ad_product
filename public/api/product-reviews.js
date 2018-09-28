// =======================
// get the packages we need ============
// =======================
const express = require('express')
const app = express()
app.use(express.json());
const path = require('path')
const fetch = require('node-fetch')
var cors = require('cors');

var mysql = require('mysql');
//var product = require('./product.js');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file
var User = require('../models/users'); // get our mongoose model

// =======================
// configuration =========
// =======================
const PORT = process.env.PORT || 3027;
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable
app.use(cors());

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  database: "product",
  insecureAuth: true
});
var sql = "select * from product_reviews";

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql, function(err, result) {
    if (err) throw err;
    console.log("Result: " + result);
  });
});

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
  res.send('Hello! The API is running at http://localhost:' + PORT);
});

app.get('/setup', function(req, res) {

  // create a sample user
  var rsingh = new User({
    name: 'R Singh',
    password: 'password',
    admin: true
  });

  // save the sample user
  rsingh.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({
      success: true
    });
  });
});

// API ROUTES -------------------

// get an instance of the router for api routes
var apiRoutes = express.Router();

// route to authenticate a user (POST http://localhost:<PORT>/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({
        success: false,
        message: 'Authentication failed. User not found.'
      });
    } else if (user) {
      // check if password matches
      if (user.password != req.body.password) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {
        // if user is found and password is correct
        // then create a token with only our given payload
        // we don't want to pass in the entire user since that has the password and this may be a security threat
        const payload = {
          admin: user.admin
        };
        var token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }
  });
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});

// route to show a random message (GET http://localhost:<PORT>/api/)
apiRoutes.get('/', function(req, res) {
  res.json({
    message: 'Welcome to the AD product reviews API!'
  });
});

// route to return all users (GET http://localhost:<PORT>/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

// apply the routes to AD application with the prefix /api
app.use('/api', apiRoutes);

app.get('/api/review/:product_id', (req, res) => {
  var id = req.params.product_id;
  console.log('Inside review get call :::');
  con.query('select * from product_reviews where product_id =?', [id], function(err, rows) {
    if (err) throw err;
    res.json({
      rows
    });
  });
});

app.post('/api/review/', (req, res) => {
  var input = JSON.parse(JSON.stringify(req.body));
  console.log('Inside add review post call :::');
  var data = {
    product_id: input.product_id,
    avg_review_score: input.avg_review_score,
    num_of_reviews: input.num_of_reviews
  };
  con.query('insert into product_reviews set ?', data, function(err, rows) {
    if (err) throw err;
    console.log('Insertion of new product reviews was successfull');
    res.json({
      rows
    });
  });
});

app.put('/api/review/:product_id', (req, res) => {
  var input = JSON.parse(JSON.stringify(req.body));
  console.log('Inside add review edit call :::');
  var id = req.params.product_id;
  var data = {
    avg_review_score: input.avg_review_score,
    num_of_reviews: input.num_of_reviews
  };
  con.query('update product_reviews set ? where product_id = ?', [data, id], function(err, rows) {
    if (err) throw err;
    console.log('Updation of existing product reviews was successfull');
    res.json({
      rows
    });
  });
});

app.delete('/api/review/:product_id', (req, res) => {
  var id = req.params.product_id;
  console.log('Inside review delete call :::');
  con.query('delete from product_reviews where product_id =?', [id], function(err, rows) {
    if (err) throw err;
    res.json({
      rows
    });
  });
});

app.use(express.static(__dirname + '/'))
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
module.exports = app;
