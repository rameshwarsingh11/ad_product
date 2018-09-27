
const express = require('express')
const app = express()
const path = require('path')
const fetch = require('node-fetch')
const PORT = process.env.PORT || 3003
var mysql = require('mysql');
var product = require('./product.js');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "rootroot",
  insecureAuth : true
});
var sql="select * from product.product_reviews";

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query(sql, function (err, result) {
   if (err) throw err;
   console.log("Result: " + result);
 });
});

app.get('/review/:product_id', (req,res) => {
var id = req.params.product_id;
console.log('Inside review get call :::');
con.query('select * from product.product_reviews where product_id =?',[id], function(err,rows)
{
  if (err) throw err;
  res.json({rows});
});

});

app.get('/api/user', (req, res) => {
  res.json({ name: 'Richard' });
});

app.get('/api/books', (req, res) => {
  res.json({ books: 545 });
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
  ]).then(([product,{rows}]) =>
    res.send({
      product:product,
      reviews:rows
    }))
    .catch(err => res.send('Ops, something has gone wrong'))
})

app.use(express.static(__dirname + '/'))
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`))
