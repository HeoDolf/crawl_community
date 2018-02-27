const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

const parser = require('./CrawlerParser.js');

/**
 * 1. 한번에 하나의 Board만 Crawling
 * 2. 그렇다면 Url은 간단하게 작성하면 됨.
 */
const Crawler = function( info, baseTime ){
    this.baseDate = {
        text: baseTime,
        time: new Date( baseTime ).getTime()
    };
    this.setting = {
        community: info._community.name,
        host: info._community.host,
        uri: info.uri,
        pageQuery: info._community.pageQuery,
        startPage: info._community.startPage,
        header:{
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36',
            'Content-Type': 'text/html; charset=utf-8'
        }
    }
    this.URL = this.makeURL( this.setting.startPage );
    this.parser = parser[this.setting.community];
}
Crawler.prototype.makeURL = function( page ){
    return this.setting.host + this.setting.uri + this.setting.pageQuery + page;
}
/**
 * 1. Run
 */
Crawler.prototype.run = function(){
    console.log( "run " );
    // Do Crawl
}

/**
 * 2. scraping
 */
Crawler.prototype.scraper = function( page, callback ){
    const options = {
        url: this.makeURL( page ),
        headers: this.setting.header,
        jar: request.jar()
    }
    const that = this;
    const scrap = request( options, function(error, response, body){
        if( error ) callback( {errorCode: 500, error: error, msg:"Scraping Error"} );
        
        const $ = cheerio.load(body);
        const result = that.parser.getContent( $, that.baseDate.time );
        if( result.checkNextPage ){
            return that.scraper( page+=1, function(error, pages, collection){
                if( error ) callback( error );
                pages = [page-1].concat(pages);
                collection = result.contents.concat( collection );
                callback( null, pages, collection );
            });
        }
        callback( null, [page], result.contents );
    });
}
Crawler.prototype.scraping = function( callback ){
    const that = this;
    return new Promise(function(resolve, reject){
        that.scraper( that.setting.startPage, function(error, pages, contents){
            if( error ) return reject( error );
            resolve({
                pages: pages,
                contents: contents
            });
        });
    });
}/**
 * 3. cleanning
 */
Crawler.prototype.cleanning = function(){

}

module.exports = Crawler;

/**
 * withLogin, intervalItem은 Client에서 최초 1회만 입력받으면 되는 정보들
 */

