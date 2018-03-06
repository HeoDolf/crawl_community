const express = require('express');
const { Page, Community, Board } = require('./../../models');

const Router = express.Router();

const session = {
    user: {
        _id: '5a9133b2625f4f1ce0bd9966'
    }
}
// Insert
Router.post('/page', (req,res)=>{
    Community.findOne(
        { 
            name:req.body.community
        }, 
        function(error, exist){
        if( error ) return res.status(500).json({errorCode: 500, error: error});
        const page = new Page({
            title: req.body.title,
            _creator: session.user._id,
            _community: exist._id,
            index: req.body.index,
            _board: req.body.board
        });
        page.save(function(error, page){
            if( error ) return res.status(500).json({errorCode: 500, error: error });
            res.redirect('/');
        });
    });
});
// Delete
Router.delete('/page', (req,res)=>{
    Page.remove({
        _creator: session.user._id,
        title: req.body.title,
        index: req.body.index
    }, function(error, result){
        if( error ) return res.status(500).json({
            errorCode: 500,
            error: error
        });
        if( result.ok === 0 ) return res.status(401).json({
            errorCode: 401,
            error: "Invalid Page Info",
            msg: ''
        });
        res.status(200).json({
            result: "success"
        });
    });
});

// Find All
Router.get('/page', (req,res)=>{
    Page.find(
        {   // Condition
            _creator: session.user._id,
        },
        {   // Selector
            _id: 0, _creator: 0, __v: 0
        },
        {   // Option
            sort: { index: 1 }
        }
    ).populate({
        path: '_community',
        select: 'name name_kor -_id'
    }).populate({
        path: '_board'
    }).exec(function(error, pages){
        if( error ) return res.status(500).json({
            errorCode: 500, 
            error: error,
            msg: "Page Find Error"
        });

        req.session.board = []; // reset
        for(let i = 0; i < pages.length; i++){
            initSession( req.session, pages[i] );
        }
        console.log( req.session );

        return res.status(200).json({
            list: pages
        });
    });
});

function initSession( session, page ){
    // if( !session.page ){ session.page = []; }
    // session.page.push( page );

    if( !session.board ){ session.board = []; }
    for(let i = 0; i < page._board.length; i++){
        session.board.push({
            community: page._community.name,
            board: page._board[i].name,
            baseTime: "00:00:00",
            contents: []
        });
    }
}


module.exports = Router;