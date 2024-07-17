const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: '148.66.138.145',
  user: 'dbusrShnkr24',    
  password: 'studDBpwWeb2!', 
  database: 'dbShnkr24stud' 
});