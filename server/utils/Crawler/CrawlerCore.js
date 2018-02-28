const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

const parser = require('./CrawlerParser.js');

const DATE = new Date();
const TODAY = `${DATE.getFullYear()}-${DATE.getMonth()+1}-${DATE.getDate()}`;

/**
 * 1. 한번에 하나의 Board만 Crawling
 * 2. 그렇다면 Url은 간단하게 작성하면 됨.
 */
const Crawler = function( info, baseTime, loginUser ){
    this.baseDate = {}
    this.baseDate.text = `${TODAY} ${baseTime}`;
    this.baseDate.time = new Date(this.baseDate.text).getTime();

    this.setting = {
        community: info._community.name,
        // For URL
        host: info._community.host,
        uri: info.uri,
        pageQuery: info._community.pageQuery,
        startPage: info._community.startPage,
        // For Request
        header:{
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36',
            'Content-Type': 'text/html; charset=utf-8'
        },
        withLogin: {
            do: info.withLogin,
            user: loginUser
        },
        cookieJar: null,
    }
    this.parser = parser[this.setting.community];
}
Crawler.prototype.makeURL = function( page ){
    return this.setting.host + this.setting.uri + this.setting.pageQuery + page;
}
/**
 * 1. Scraper
 */
Crawler.prototype.scraper = function( page, callback ){
    const options = {
        url: this.makeURL( page ),
        headers: this.setting.header,
        jar: this.setting.cookieJar
    }
    const that = this;
    const scrap = request( options, function(error, response, body){
        if( error ) return callback({
            errorCode: 500, 
            error: error, 
            msg:"Scraping Error"
        });
         
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
/**
 * 2. Runner
 */
Crawler.prototype.run = function( callback ){
    const that = this;
    return new Promise(function(resolve, reject){
        if( that.setting.withLogin.do === 1 ){

            let loginOption = that.parser.loginOption( that.setting.withLogin.user );
            loginOption.headers = that.setting.header;
            loginOption.jar = request.jar();
            
            const reqLogin = request(loginOption, function(error, res, body){
                if(error) return reject({
                    errorCode:500, 
                    error:error, 
                    msg:'With Login Error'
                });
                if( body.indexOf(loginOption.errorMsg) !== -1 ) return reject({
                    errorCode:401, 
                    error:'Please check your ID/PWD'
                });
                // Set Cookie-Jar
                that.setting.cookieJar = loginOption.jar;

                return resolve( loginOption );
            });
        } else {
            return resolve( null );
        }
    }).then(( cookie )=>{
        return new Promise(function(resolve, reject){
            that.scraper( that.setting.startPage, function(error, pages, contents){
                if( error ) return reject( error );
                resolve({
                    pages: pages,
                    contents: contents
                });
            });
        });
    });
}
module.exports = Crawler;
