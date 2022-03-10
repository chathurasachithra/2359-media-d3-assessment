# 2359-media-d3-assessment

## About

This repository contains NodeJS API assessment given in https://gist.github.com/d3hiring/4d1415d445033d316c36a56f0953f4ef

## Required services and configs

NodeJs - v14.17.6 or Higher
Mysql

## How to setup

Clone the application
Create mysql database 'assignment_db'
Import database dump from 'helpers\assignment_db.sql'
Change the db configs in 'database\models\index.js' file (host, username and password)
Run 'npm install' in the terminal
Run 'npm start' in the terminal
Access the application in 'http://localhost:3000'

## Try and test the application
Import the given postman collection in 'helpers\d3hiring_assignment.postman_collection.json'
For run the unit tests, run 'npm run test'
For check the test code coverage, run 'npm run coverage'

