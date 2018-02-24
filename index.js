// import
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/', express.static('./public'));
app.use(function(error, req, res, next){
    console( error, req, res, next );
});

app.use('/api', require('./routes') );

app.listen(PORT, ()=>console.log('SERVER CONNECTION!!!', PORT));