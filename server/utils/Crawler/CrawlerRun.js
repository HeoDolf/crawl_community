const Crawler = require('./CrawlerCore.js');
const { Community, Board } = require('./../../models');

module.exports = function( comName, bodName, delay, callback ){
    return new Promise((resolve, reject)=>{
        Board.findOne({
            name: bodName,
            "community.name": comName
        }, {
            __v: 0, 
            _id: 0, 
            regDate: 0
        }, function(error, board){
            if( error ) return reject({
                errorCode: 500, 
                error:error, 
                msg:"Board Find Error" 
            });
            Community.findOne({
                name: comName
            },{
                _id: 0,
                host: 1, 
                pageQuery: 1, 
                startPage: 1, 
                name: 1, 
                name_kor: 1
            }, function(error, community){
                if( error ) return reject({
                    errorCode: 500, 
                    error:error, 
                    msg:"Community Find Error"
                });

                let data = JSON.parse(JSON.stringify( board ));
                data.community = community;

                resolve(data);
            })
        });
    }).then((data)=>{
        // Run Crawl
        let loginUser = null;
        if( data.withLogin === 1 ){
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
        setTimeout(()=>{
            new Crawler( data, loginUser ).run( callback );
        }, typeof delay !== 'number' ? 0 : delay )
    });
}
