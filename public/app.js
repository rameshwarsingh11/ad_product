const express = require('express')
const app = express()
app.use(express.json());
const path = require('path')
const fetch = require('node-fetch')
const PORT = process.env.PORT || 3003
var mysql = require('mysql');
var product = require('./product.js');

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

app.get('/review/:product_id', (req, res) => {
  var id = req.params.product_id;
  console.log('Inside review get call :::');
  con.query('select * from product_reviews where product_id =?', [id], function(err, rows) {
    if (err) throw err;
    res.json({
      rows
    });
  });
});

app.post('/review/', (req, res) => {
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

app.delete('/review/:product_id', (req, res) => {
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

app.get('/product/:product_id', (req, res) => {
  Promise.all([
      get(`https://www.adidas.co.uk/api/products/${req.params.product_id}`),
      get(`http://localhost:${PORT}/review/${req.params.product_id}`),
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
