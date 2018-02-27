const db = require('./../config/database');
const { Community, Board } = require('./../models');

const Crawler = require('./Crawler');

// Get Data
const user = "5a9133b2625f4f1ce0bd9966";
const comName = "gezip";
const bodName = "entertaine";

const Crawling = new Promise((resolve, reject)=>{
    // Get Data
    Board.findOne({
        name: bodName
    }).populate({
        path: '_community',
        select: 'name host pageQuery startPage'
    }).exec(function(error, board){
        if(error) return reject({errorCode: 500, error:error, msg:"DB Find Eerror"});
        resolve( board );
    });
}).then((board)=>{
    // Run Crawl
    const baseTime = '2018-02-26 9:00:00';
    const crawler = new Crawler( board, baseTime );
    return crawler.scraping();
}).then((data)=>{
    console.log(data, data.contents.length);

    process.exit();
}).catch((error)=>{
    console.error( error );
});