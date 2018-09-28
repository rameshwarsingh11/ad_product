var app = require('./product-reviews');
const express = require('express')
const product = express()
product.use(express.json());
const path = require('path')
const fetch = require('node-fetch')
var cors = require('cors');
const PORT = process.env.PORT || 3028; // used to create, sign, and verify tokens

function get(url) {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(err => reject(err))
  })
}

product.get('/api/product/:product_id', (req, res) => {
  console.log('Inside Aggregate service call:::');
  Promise.all([
      get(`https://www.adidas.co.uk/api/products/${req.params.product_id}`),
      get(`http://localhost:3027/api/review/${req.params.product_id}?token=${req.query.token}`),
    ]).then(([product, {
        rows
      }]) =>
      res.send({
        reviews: rows,
        product: product
      }))
    .catch(err => res.send('Ops, something has gone wrong'))
});

product.use(express.static(__dirname + '/'))
product.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
module.exports = product;
