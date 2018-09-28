//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
let product_reviews = require('../public/api/product-reviews');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../public/server');
let should = chai.should();

chai.use(chaiHttp);

var data = {
  "name": "R Singh",
  "password": "password"
};

var put_data = {
  "product_id": "C77154",
  "avg_review_score": 3.6,
  "num_of_reviews": 115
}

var post_data = {
  "product_id": "C77155",
  "avg_review_score": 3.8,
  "num_of_reviews": 116
}

describe('Authentication', (data) => {
  beforeEach((done) => { //Before each test we get the JWT token for Authentication.
    product_reviews.post('/api/authenticate', data, (err) => {
      done();
    });
  });

  /*
   * Test the /GET route of product-reviews service
   */
  describe('/GET product-reviews ', (req, res) => {
    it('it should GET the product reviews with product_id', (done) => {
      chai.request(server)
        .get('/api/review/C77154?token=${req.query.token}')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  /*
   * Test the /PUT route of product-reviews service
   */
  describe('/PUT product-reviews ', (req, res) => {
    it('it should PUT the product reviews with product_id', (done) => {
      chai.request(server)
        .put('/api/review/C77154?token=${req.query.token}')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  /*
   * Test the /DELETE route of product-reviews service
   */
  describe('/DELETE product-reviews ', (req, res) => {
    it('it should DELETE the product reviews with product_id', (done) => {
      chai.request(server)
        .delete('/api/review/C77154?token=${req.query.token}')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });
  /*
   * Test the /POST route of product-reviews service
   */
  describe('/POST product-reviews ', (req, res) => {
    it('it should POST the product reviews with new product_id', (done) => {
      chai.request(server)
        .put('/api/review?token=${req.query.token}')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });



});
