const Crawler = require('./CrawlerCore.js');

const { Community, Board } = require('./../../models');

module.exports = function( comName, bodName, baseTime ){
    return new Promise((resolve, reject)=>{
        Community.findOne(
            {
                name: comName
            }, 
            function(error, community){
                if( error ) return reject({
                    errorCode:500,
                    error: error,
                    msg: "Community Find Error"
                });
                // Get Data
                Board.findOne({
                    name: bodName,
                    _community: community._id
                }).populate({
                    path: '_community',
                    select: 'name host pageQuery startPage'
                }).exec(function(error, board){
                    if(error) return reject({
                        errorCode: 500, 
                        error:error, 
                        msg:"Board Find Error"
                    });
                    resolve( board );
                });
            }
        );
    }).then((board)=>{
        // Run Crawl
        let loginUser = null;
        if( board.withLogin === 1 ){
            if( comName === 'ygosu' ){
                loginUser = {
                    username: 'vvve12',
                    password: 'wjddns1'
                }
            } else if ( comName === 'gezip' ){
                loginUser = {
                    username: 'dnjsakf',
                    password: 'wjddns1'
                }
            }
        }
        const crawler = new Crawler( board, baseTime, loginUser );
        return crawler.run();
    });
}
