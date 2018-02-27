const bcrypt = require('bcryptjs');

const db = require('./../config/database');
const { Community, Board } = require('./../models');

const Crawler = require('./Crawler');

// Get Data
const user = "5a9133b2625f4f1ce0bd9966";
const comName = "gezip";
const bodName = "sexy";
const baeTime = '8:00:00';

const Crawling = new Promise((resolve, reject)=>{
    // Get Data
    Board.findOne({
        name: bodName
    }).populate({
        path: '_community',
        select: 'name host pageQuery startPage'
    }).exec(function(error, board){
        if(error) return reject({
            errorCode: 500, 
            error:error, 
            msg:"DB Find Eerror"
        });
        resolve( board );
    });
}).then((board)=>{
    // Run Crawl
    let loginUser = null;
    if( board.withLogin === 1 ){
        loginUser = {
            username: 'dnjsakf',
            password: 'wjddns1'
        }
    }
    const crawler = new Crawler( board, baseTime, loginUser );
    return crawler.run();
}).then((data)=>{
    // send data
    console.log(data.contents);
    console.log(data.pages);

    process.exit();
}).catch((error)=>{
    console.error( error );
    process.exit();
});