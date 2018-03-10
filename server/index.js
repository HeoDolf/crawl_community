// import
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
// DataBase
const mongoose = require('./config/database.js');
// Session
const sessionConfig = require('./config/session.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Socket

// Configure
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(sessionConfig);

app.use('/', express.static( path.resolve(__dirname, './../dist') ));

// Handle Route
let filePath = 'public';
if( process.env.NODE_ENV === 'production' ){
    filePath = 'dist';
}

app.use('/api', require('./routes') );
app.get('*', (req, res, next)=>{
    // if( req.path.split('/')[1] === 'static') return next();
    fs.readFile( path.resolve(__dirname, '../dist/index.html'), (error, data)=>{
        if( error ) throw error;
        res.setHeader("Content-Type", "text/html");
        res.send( data );
    });
});

// Handle Error
app.use((err, req, res, next)=>{
    console.error('[throw-error]', err.code, err.msg, err.error.stack);
    return res.status(err.code).json({
        code: err.code,
        error: err.error,
        msg: err.msg
    });
});

// Connect to Server
app.listen(PORT, ()=>console.log('SERVER CONNECTION!!!', PORT));