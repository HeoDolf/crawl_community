const express = require('express');
const carwler = require('./../../utils/Crawler');

const { Content } = require('./../../models');

const Router = express.Router();

// content로 바꿔야됨
Router.get('/crawler/:community/:board', (req,res)=>{
    const community = req.params.community;
    const board = req.params.board;

    const session = getSession(req.session, {community, board});
    if( !session ) return res.status(404).json({
        errorCode: 404,
        error: "Session Error: Not Found Board Sesssion"
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

Router.get('/content/:community/:board', (req,res)=>{
    const baseTime = req.query.baseTime;
    Content.find({
        name: req.params.board,
        community : req.params.community,
        "content.date": {
            $gt: new Date( baseTime )
        }
    },function(error, result){
        if( error ) return res.status(500).json({
            errorCode: 500,
            error: error,
            msg: "Find Content Error"
        });
        return res.status(200).json({
            list: {
                new: result
            }
        })
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