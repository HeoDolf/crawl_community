const express = require('express');
const carwler = require('./../../utils/Crawler');

const Router = express.Router();

Router.get('/crawler/:community/:board', (req,res)=>{
    const community = req.params.community;
    const board = req.params.board;

    // Session이 없으면 다음을 진행하면 안되지.
    const session = getSession(req.session, {community, board});
    if( !session ) return res.status(500).json({
        errorCode: 500,
        error: "Session Error: Invalid Index"
    });
    // Run Crawler
    const baseTime = req.query.baseTime !== 'null' ? req.query.baseTime : session.baseTime;
    const crawled = carwler(community, board, baseTime);
    crawled.then((data)=>{
        const news = data.contents;
        const olds = session.contents;
        
        // Save req.Session
        session.contents = news.concat( olds );
        session.baseTime = news.length > 0 ? news[0].date[1] : session.baseTime;

        return res.status(200).json({
            community: community,
            board: board,
            pages: data.pages,
            baseTime: session.baseTime,
            list: {
                new: news,
                old: olds
            }
        });
    }).catch((error)=>{
        return res.status(error.errorCode).json(error);
    });
});

function getSession( session, data ){
    if( typeof session.board === 'undefined' ){ return false; }
    for(let i = 0; i < session.board.length; i++){
        if( session.board[i].community === data.community
            && session.board[i].board === data.board ){
                return session.board[i];
            }
    }
    return false;
}

module.exports = Router;