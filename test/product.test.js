//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let product = require('../public/api/product-service');
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

describe('Authentication', (data) => {
  beforeEach((done) => { //Before each test we get the JWT token for Authentication.
    product_reviews.post('/api/authenticate', data, (err) => {
      done();
    });
  });

  //Our parent block service
  describe('Product', () => {
    beforeEach((done) => { //Before each test we ping the server
      product.get('/api/product', (err) => {
        done();
      });
    });
    /*
     * Test the /GET route of product service
     */
    describe('/GET product ', () => {
      it('it should GET the product with product_id', (done) => {
        chai.request(server)
          .get('/api/product/C77154')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.eql(0);
            done();
          });
      });
    });
  });
});
