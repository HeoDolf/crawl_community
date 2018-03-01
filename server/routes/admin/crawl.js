const express = require('express');
const carwler = require('./../../utils/Crawler');

const Router = express.Router();

Router.get('/crawler/:community/:board', (req,res)=>{
    let session = req.session;
    const community = req.params.community;
    const board = req.params.board;
    const baseTime = req.query.baseTime;

    const crawled = carwler(community, board, baseTime)
    crawled.then((data)=>{
        const index = getSessionIndex(session, {community, board})
        if( index === -1 ) return res.status(500).json({
            errorCode: 500,
            error: "Session Error: Invalid Index"
        });

        const news = data.contents;
        const olds = session.board[index].contents;
        
        // Save Session
        session.board[index].contents = news.concat( olds );
        session.board[index].baseTime = baseTime;

        res.status(200).json({
            pages: data.pages,
            list: {
                new: news,
                old: olds
            }
        });
    });
    crawled.catch((error)=>{
        res.status(error.errorCode).json(error);
    });
});

function getSessionIndex( session, data ){
    if( typeof session.board === 'undefined' ){
        return -1;  // 여기서 session.board가 없으면 접근이 잘못된 것
    }
    // Find Board Index
    let index = -1;
    for(let i = 0; i < session.board.length; i++){
        if( session.board[i].community === data.community
            && session.board[i].board === data.board ){
                index = i;
                break;
            }
    }
    return index;
}

module.exports = Router;