// =======================
// get the packages we need ============
// =======================
const express = require('express')
const app = express()
app.use(express.json());
const path = require('path')
const fetch = require('node-fetch')

var mysql = require('mysql');
var product = require('./product.js');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User = require('./models/users'); // get our mongoose model

// =======================
// configuration =========
// =======================
const PORT = process.env.PORT || 3006; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

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

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)

// TODO: route middleware to verify a token

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({
    message: 'Welcome to the product reviews API!'
  });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

// apply the routes to our application with the prefix /api
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

app.put('/review/:product_id', (req, res) => {
  var input = JSON.parse(JSON.stringify(req.body));
  console.log('Inside add review edit call :::');
  var id = req.params.product_id;
  var data = {
    avg_review_score: input.avg_review_score,
    num_of_reviews: input.num_of_reviews
  };
  con.query('update product_reviews set ? where product_id = ?', [data, id], function(err, rows) {
    if (err) throw err;
    console.log('Updatation of existing product reviews was successfull');
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

function get(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
}

app.get('/api/product/:product_id', (req, res) => {
  Promise.all([
      get(`https://www.adidas.co.uk/api/products/${req.params.product_id}`),
      get(`http://localhost:${PORT}/api/review/${req.params.product_id}`),
    ]).then(([product, {
        rows
      }]) =>
      res.send({
        product: product,
        reviews: rows
      }))
    .catch(err => res.send('Ops, something has gone wrong'))
})

app.use(express.static(__dirname + '/'))
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
