const { Page } = require('./../../models');
const express = require('express');
const Router = express.Router();

// Test Data
const session = {
    user: {
        _id: '5a9133b2625f4f1ce0bd9966'
    }
}

// 그럼 새로운 Page가 추가되었을 때는 어떻게 처리할까?
Router.get('/session/board', (req,res)=>{
    // Check
    if( typeof req.session.board !== 'undefined' ){
        return res.status(200).json({
            result: true,
            msg: "Exist Board Session"
        })
    }
    
    // Make
    Page.find({
        _creator: session.user._id
    }).populate({
        path: '_board'
    }).exec(function(error, pages){
        if( error ) throw { code: 500, error: error,  msg: "Page Find Error" }

        req.session.board = [];
        for(let i = 0; i < pages.length; i++){
            for(let j = 0; j < pages[i]._board.length; j++){
                let board = pages[i]._board[j];

                req.session.board.push({
                    community: board.community,
                    board: board.name,
                    baseTime: "00:00:00",
                    contents: []
                });
            }
        }
        return res.status(200).json({
            result: true,
            msg: "Create Board Session",
            session: req.session.board
        })
    });
});


module.exports = Router;