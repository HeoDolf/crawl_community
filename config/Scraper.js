// Default
const moment = require('moment');
const db = require('./../server/config/database');
const { Community, Board, Content } = require('./../server/models');
const crawler = require('./../server/utils/Crawler');

// 이 딜레이도 게시판마다 글 리젠 속도가 다르니까
// 거기에 맞춰서 저장하고 가져오는 걸로...
const DELAY = 30000;

const communityInfo = new Promise((resolve, reject)=>{
    Community.find(
        // { name: 'gezip' }
        null
    , {
        _id: 0, name: 1, board: 1
    }).populate({
        path: "board",
        select: 'name -_id'
    }).exec(function(error, communities){
        if( error ) return reject({
            errorCode: 500,
            error: error,
            msg: "Community Find Error For Crawler"
        });
        try {
            let data = [], community, board;
            for(let i = 0; i < communities.length; i++){
                community = communities[i];
                for(let j = 0; j < community.board.length; j++){
                    board = community.board[j];
                    data.push({
                        community: community.name,
                        board: board.name
                    })
                }
            }
            resolve( data );
        } catch ( error ) {
            return reject({
                errorCode: 401,
                error: error,
                msg: "Communities Loop Error"
            });
        }
    });
});
communityInfo.then(( data )=>{
    try {
        // // Handle Crawler: loop
        for(let index=0; index < data.length; index++){
            // const index = 0;
            const community = data[index].community
            const board = data[index].board;
            crawler( community, board, 0, handleCrawler);
        }
    } catch (error){
        return Promise.reject( error );
    }
}).catch((error)=>{
    // Handle Error
});

function handleCrawler( error, result, info ){
    if( error ) return console.error( error );
    if( result.contents.length === 0 ){
        // Re-call: crawler
        console.log( "No New Contents", info);
        return crawler(info.community, info.board, DELAY, handleCrawler);
    }
    const contents = result.contents.map((el, index)=>{
        return {
            community: info.community,
            board: info.board,
            content: el,
            regDate: new Date() // ISO로 저장되며, 540분이 차이가 남
        }
    });
    try {
        Content.collection.insert(contents, (error)=>{
            if( error ) return console.error( error );
            Board.update({
                name: info.board,
                "community.name": info.community
            },{
                $set: { 
                    // (1) 2018-03-12 13:13:00  ->  (2) 2018-03-12T04:13:00Z
                    // (1) 형식의 날자 데이터는 ISO 형식으로 바뀌면서 540분이 차이가 남.
                    lastUpdate:  contents[0].content.date // + ( 540 * 60 * 1000 ); // isSeoulTime
                }
            }, function(error, updated){
                if( error ) return console.error( error );
                console.log(`[update ${info.community} ${info.board}]`, contents.length );
                return crawler(info.community, info.board, DELAY, handleCrawler);
            });
        });
    } catch (error) {
        process.exit();
    }
}