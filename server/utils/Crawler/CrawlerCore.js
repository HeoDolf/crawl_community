const Iconv = require('iconv').Iconv;
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

const parser = require('./CrawlerParser.js');

const iconv = new Iconv('euc-kr', 'utf-8//translit//ignore');

const Crawler = function( board, user ){
    this.baseDate = {}
    this.baseDate.text = board.lastUpdate;
    this.baseDate.time = new Date(this.baseDate.text).getTime();

    this.setting = {
        // Names
        community: board.community.name,
        board: board.name,
        // For URL
        host: board.community.host,
        uri: board.uri,
        pageQuery: board.community.pageQuery,
        startPage: board.community.startPage,
        // For Request
        header:{
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36',
            'Content-Type': 'text/html; charset=utf-8'
        },
        // For Auth
        withLogin: {
            do: board.withLogin,
            user: user
        },
        cookieJar: null,
    }
    this.parser = parser[this.setting.community];
}
Crawler.prototype.makeURL = function( page ){
    return this.setting.host + this.setting.uri + this.setting.pageQuery + page;
}
/**
 * 1. Runner
 */
Crawler.prototype.run = function( callback ){

    console.log('[crawler-run]', this.setting.community, this.setting.board, this.baseDate.text );    

    const that = this;
    return new Promise(function(resolve, reject){
        // Login Check
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
                return resolve( loginOption.jar );
            });
        } else {
            return resolve( null );
        }
    }).then(( cookie )=>{
                // Set Cookie-Jar
        that.setting.cookieJar = cookie;
        that.scraper( that.setting.startPage, ( error, pages, contents )=>{
            // failure
            if( error ) return callback( error );
            // success
            return callback( null, {
                pages: pages, 
                contents: contents
            }, {
                community: that.setting.community,
                board: that.setting.board,
            })            
        });
    });
}
/**
 * 2. Scraper
 */
Crawler.prototype.scraper = function( page, callback ){
    const that = this;
    const options = {
        url: that.makeURL( page ),
        headers: that.setting.header,
        jar: that.setting.cookieJar,
        encoding: null  // binary
    }
    console.log( options.url );
    const scrap = request( options, function(error, response, buffer){
        if( error ) return callback({
            errorCode: 500, 
            error: error, 
            msg: "Scraping Error"
        });

        let body = buffer;
        if( that.setting.community === 'humoruniv' ){
            body = iconv.convert( buffer );  // Convert 'euc-kr' to 'utf-8'
        }

        const $ = cheerio.load( body.toString() );
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
module.exports = Crawler;
