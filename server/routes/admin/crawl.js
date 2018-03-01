const express = require('express');
const carwler = require('./../../utils/Crawler');

const Router = express.Router();

// 누적 데이터를 세션에 저장했다가
// 이걸 빼와서 보내주는게 나을지,
// 아니면 한번 보낸 데이터는 거기서 저장하는게 나을지..
// 최초 1회는 세션에 저장해서보내고, 
// 그 이후에는 client에서 저장하면서 하면..
// client가 너무 무거워 지겠구나  
// 그럼 server에서 저장해서 보내는 걸로
Router.get('/crawler/:community/:board', (req,res)=>{
    let session = req.session;
    const community = req.params.community;
    const board = req.params.board;
    const baseTime = req.query.baseTime;

    const crawled = carwler(community, board, baseTime)
    crawled.then((data)=>{
        const index = saveSession(session, {
            community: community,
            board: board,
            baseTime: baseTime,
            contents: data.contents
        });

        console.log( board, index, data.contents.length );

        res.status(200).json({
            pages: data.pages,
            list: index === -1 ? [] : data.contents
        });
    });
    crawled.catch((error)=>{
        res.status(error.errorCode).json(error);
    });
});

function saveSession( session, data ){
    let index = -1;
    // if( !session.contents ){ session.contents = []; }    // board.js 에서 생서
    for(let i = 0; i < session.contents.length; i++){
        if( session.contents[i].community === data.community
            && session.contents[i].board === data.board ){
                index = i;
                break;
            }
    }
    const sessContents = session.contents[index].contents;
    if( sessContents.length > 0 ){
        console.log( "[Same Last Item]", sessContents[0].no === data.contents[0].no, sessContents[0].no, data.contents[0].no );
        if( sessContents[0].no === data.contents[0].no ){
            return -1;
        }
    }
    session.contents[index].contents = data.contents.concat(sessContents);
    return index;
}

module.exports = Router;