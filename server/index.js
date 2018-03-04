// import
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./config/database.js');
const sessionConfig = require('./config/session.js');

const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(sessionConfig);

app.use('/', express.static('./../public'));
// Handle Error 
app.use(function(error, req, res, next){
    console.error('[throw-error]', error.stack);
    return res.status(500).json({
        error: error,
        next: next,
        code: 500,
        msg: "Something broken!!!"
    });
});

// Handle Route
app.use('/api', require('./routes') );

// Connect to Server
app.listen(PORT, ()=>console.log('SERVER CONNECTION!!!', PORT));

if( process.env.NODE_ENV === 'production'){
    app.get('*', (req,res)=>{
        fs.readFile('./dist/index.html', (error, data)=>{
            if( error ) {
                return res.status(500).json({
                    errorCode: 500,
                    error: error
                });
            }
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send( data );
        });
    });
}
