# ad_product
Microservices to retrieve product details along with product reviews

Tools required : Node js, express, Mongo db, MySQL, Any code editor

Synchrnous microservice architecture approach has been ued to create two microservices Product Service & Product review service. Both can run independently on a different ports. FOr authentication mongo db & jwb token sign implementation is done inside app routes.

How to Run :

1. Download MySQL Community server
2. Run MYSQL server 
3. Run the below script :

create database product;
create table product_reviews (product_id varchar(20) not null, avg_review_score float ,num_of_reviews int, primary key (product_id));
insert into product_reviews ( product_id, avg_review_score, num_of_reviews ) values ('M20324',4.5,53);
insert into product_reviews ( product_id, avg_review_score, num_of_reviews ) values ('AC7836’,5.0,20);
insert into product_reviews ( product_id, avg_review_score, num_of_reviews ) values ('C77154',3.3,101);
insert into product_reviews ( product_id, avg_review_score, num_of_reviews ) values ('BB5476',3.9,200)
insert into product_reviews ( product_id, avg_review_score, num_of_reviews ) values ('B42000',2.8,45);

4. go to your node project dir
5. npm install
6. nodemon start.js


Generate your token :
http://localhost:3017/api/authenticate
Body Values as below --
name : R Singh
password : password

Sample response :
{
    "success": true,
    "message": "Enjoy your token!",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTM4MDUxMzEwLCJleHAiOjE1MzgwNTI3NTB9.GZUH-C93JqVkgHGec9vifAdSgV5lLr46K6l_F-xUQg8"
}

============


The Product APIs will be running at below ports :
a. http://localhost:3021/api/product/{product_id}?token={}

Sample hit :
http://localhost:3021/api/product/AC7836?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTM4MDQ3NTQxLCJleHAiOjE1MzgwNDg5ODF9.sa-HZCe8P98Fq0mO35P85LFkxj2vqeJcBXSG935IjZ0

Response :
{
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
        .....
        ...
        

b. http://localhost:3017/api/review/{product_id}

Sample hit :
http://localhost:3017/api/review/AC7836
Header Values
x-access-token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTM4MDQ2MDA4LCJleHAiOjE1MzgwNDc0NDh9.t9Dh_fXd6cCzu_EFw2-rRlsCm4NYxRwCR5MieLLcGeY

Note : you must generate a new token for the api calls.

Sample reponse :
{
    "rows": [
        {
            "product_id": "AC7836",
            "avg_review_score": 5,
            "num_of_reviews": 20
        }
    ]
}

Nodemon response :
Rameshwar-Singh:public home-v3$ nodemon app.js

[nodemon] 1.17.4
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node app.js`
(node:49785) DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new par
ser, pass option { useNewUrlParser: true } to MongoClient.connect.
Listening on http://localhost:3007
Connected!
Result: [object Object],[object Object],[object Object],[object Object],[object Object],[object Object],[object Object]
Inside review get call :::
GET /api/review/AC7836?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTM4MDQwMzk0LCJleHAiOjE1MzgwNDE4MzR9.aA
VJK8GE45vUktqB9li6Z_7ySgr_pjnVsTEFG1zTgBc 200 4.438 ms - 75
GET /api/product/AC7836?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTM4MDQwMzk0LCJleHAiOjE1MzgwNDE4MzR9.a
AVJK8GE45vUktqB9li6Z_7ySgr_pjnVsTEFG1zTgBc 200 1203.193 ms - 11521

===================================================================
Trouble shooting for MySQL Connectivity.
Issue. :

Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client

Solution : 
Run below command in MySQL workbench ( terminal )--

use mysql;
alter user 'root'@'localhost' identified with mysql_native_password by ‘rootrogot’;
flush privileges;

================================================================

Docker imgages. DockerFile config is added into development branch.
Run below command to build image :

docker build -t product-service
docker build -t product-review-service

Start your services in a container :
docker run -d -p 3000:3000 product-service
docker run -d -p 3000:3000 product-review-service

=================================================================
