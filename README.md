# Product Service & Product Review Service 

These micorservices will help retrive the product details and product reviews. Synchronous microservice architecture approach has been used to create these microservices. Both the services can run independently on different ports. For authentication mongo db & jwt token sign implementation is done using app routes.

## Setup user in Mongo : /setup

Sample request : http://localhost:3027/setup
Sample Response : {
    "success": true
}

The above endpoint will setup below user in Mongo :
    name: 'R Singh',
    password: 'password',
    admin: true 

## Generate JWT token : /api/authenticate

Endpoint : http://localhost:3027/api/authenticate

Sample Request : http://localhost:3027/api/authenticate
Body content -
name : Rsingh
password : password

Sample Response : 
{
    "success": true,
    "message": "Enjoy your token!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTM4ODcwODAzLCJleHAiOjE1Mzg4NzIyNDN9._dS6OUKQkwWntuKppGff-RJeKBG4S_IfJSSuuINd7AU"
}

## Microservice 1 : /api/product/{product_id}

Endpoint : http://localhost:3029/api/product/AC7836

Sample Request : http://localhost:3029/api/product/AC7836?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTM4ODcwODAzLCJleHAiOjE1Mzg4NzIyNDN9._dS6OUKQkwWntuKppGff-RJeKBG4S_IfJSSuuINd7AU

Sample Response : {
    "reviews": [
        {
            "product_id": "AC7836",
            "avg_review_score": 5,
            "num_of_reviews": 20
        }
    ],
    "product": {
        "id": "AC7836",
        "name": "Ultraboost Parley Shoes",
        "model_number": "AQK96",
        "product_type": "inline",
        "meta_data": {
            "page_title": "adidas Ultraboost Parley Shoes - Blue | adidas UK",
            "site_name": "adidas United Kingdom",
            "description": "Shop for Ultraboost Parley Shoes - Blue at adidas.co.uk! See all the styles and colours of Ultraboost Parley Shoes - Blue at the official adidas UK online store.",
            "keywords": "Ultraboost Parley Shoes",
            "canonical": "//www.adidas.co.uk/ultraboost-parley-shoes/AC7836.html"
        },
        "view_list": [
            {
          ....
          ......
          ........
          

## Microservice 2 : /api/review/{product_id}

### Endpoint 1 : GET /api/review/AC7836

Sample Request : http://localhost:3027/api/review/AC7836

Headers :
Content-Type : application/json
x-acces-token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTM4ODcwODAzLCJleHAiOjE1Mzg4NzIyNDN9._dS6OUKQkwWntuKppGff-RJeKBG4S_IfJSSuuINd7AU

Sample Response :
{
    "rows": [
        {
            "product_id": "AC7836",
            "avg_review_score": 5,
            "num_of_reviews": 20
        }
    ]
}

### Endpoint 2 : POST /api/review/

Sample Request : http://localhost:3027/api/review/
Headers :
Content-Type : application/json
x-access-token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTM4ODcwODAzLCJleHAiOjE1Mzg4NzIyNDN9._dS6OUKQkwWntuKppGff-RJeKBG4S_IfJSSuuINd7AU

Body :
{
"product_id" : "I891456",
"avg_review_score" : 3.8,
"num_of_reviews" : 116
}

Sample Response :
{
    "rows": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "",
        "protocol41": true,
        "changedRows": 0
    }
}


### Endpoint 3 : PUT /api/review/{product_id}

Sample Request : http://localhost:3027/api/review/I891456
Headers :
Content-Type : application/json
x-access-token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTM4ODcwODAzLCJleHAiOjE1Mzg4NzIyNDN9._dS6OUKQkwWntuKppGff-RJeKBG4S_IfJSSuuINd7AU

Body :
{
"product_id" : "I891456",
"avg_review_score" : 4.2,
"num_of_reviews" : 200
}

Sample response :
{
    "rows": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
        "protocol41": true,
        "changedRows": 1
    }
}

### Endpoint 4 : DELETE /api/review/{product_id}

Sample Request : http://localhost:3027/api/review/I891456
Headers :
Content-Type : application/json
x-access-token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTM4ODcwODAzLCJleHAiOjE1Mzg4NzIyNDN9._dS6OUKQkwWntuKppGff-RJeKBG4S_IfJSSuuINd7AU

Sample response :
{
    "rows": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "serverStatus": 2,
        "warningCount": 0,
        "message": "",
        "protocol41": true,
        "changedRows": 0
    }
}


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to create the docker images.

### Prerequisites

Below tools need to be installed to run the microservices :

1. node v 4 or above
2. express js
3. node modules as per package.json
4. MySQL Community server
5. Mongo DB ( mlab )
6. Any Code editor
7. PostMan

### Installing MYSQL

##### Step 1 : Download MySQL Community Server 
##### Step 2 : Open MySQL WorkBench
##### Step 3 : Run below scripts :

###### create database product;
###### create table product_reviews (product_id varchar(20) not null, avg_review_score float ,num_of_reviews int, primary key (product_id));
###### insert into product_reviews ( product_id, avg_review_score, num_of_reviews ) values ('M20324',4.5,53);
###### insert into product_reviews ( product_id, avg_review_score, num_of_reviews ) values ('AC7836’,5.0,20);
###### insert into product_reviews ( product_id, avg_review_score, num_of_reviews ) values ('C77154',3.3,101);
###### insert into product_reviews ( product_id, avg_review_score, num_of_reviews ) values ('BB5476',3.9,200)
###### insert into product_reviews ( product_id, avg_review_score, num_of_reviews ) values ('B42000',2.8,45);


### Running the API

###### Step 1. Download the zip file and extract in your local folder.
###### Step 2 : Go to ad_product/public folder
###### Step 3 : npm install
###### Step 4 : nodemon server.js
###### Step 5 : Check the sample message in node terminal :

###### [nodemon] 1.17.4
###### [nodemon] to restart at any time, enter `rs`
###### [nodemon] watching: *.*
###### [nodemon] starting `node server.js`
###### (node:51282) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new par ser, pass option { useNewUrlParser: true } to MongoClient.connect.
###### Listening on http://localhost:3027
###### Listening on http://localhost:3028
###### Express server for product service listening on port 3029
###### Connected!
###### Inside review get call :::
###### GET /api/review/AC7836?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTM4MTEwNTc2LCJleHAiOjE1MzgxMTIwMTZ9.FX
###### WXRULaJwJY3EaW7GNVZ7DFvbu777sl82c_6mf7rcw 200 2.930 ms - 75
###### GET /api/product/AC7836? token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTM4MTEwNTc2LCJleHAiOjE1MzgxMTIwMTZ9.FX
###### WXRULaJwJY3EaW7GNVZ7DFvbu777sl82c_6mf7rcw 200 2.930 ms - 75


## Running the tests

### Go to ad_product/test folder and run below command :
 
mocha product.test.js

mocha product.reviews.test.js

### Run PostMan 

Hit the APIs as explained in the /development/ad_product/Documentation/PostMan/PostMan_Requests.xlsx

## Deployment

Docker imgages. DockerFile config is added into development branch.
##### Run below command to build image :

###### docker build -t product-service
###### docker build -t product-review-service

##### Start your services in a container :
###### docker run -d -p 3000:3000 product-service
###### docker run -d -p 3000:3000 product-review-service

## Trouble shooting

### Issue. :

#### Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client

##### Solution : 
Run below command in MySQL workbench ( terminal )--

use mysql;

alter user 'root'@'localhost' identified with mysql_native_password by ‘rootrooot’;

flush privileges;




