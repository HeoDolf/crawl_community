const mongoose = require('mongoose');
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
    const page = new Page({
        index: req.body.index,
        title: req.body.title,
        _creator: session.user._id,
    });
    page.save(function(error, page){
        if( error ) return res.status(500).json({errorCode: 500, error: error });
        res.redirect('/');
    });
});
// Delete
Router.delete('/page', (req,res)=>{
    Page.remove({
        _id: req.body.page,
        _creator: session.user._id,
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
Router.delete('/page/board', (req,res)=>{
    Page.update({
        _creator: session.user._id,
        _id: req.body.page
    },{
        $pull: { _board: req.body.board }
    }, function(error, result){
        if( error ) return res.status(500).json({
            errorCode: 500,
            error: error,
            msg: ''
        });
        res.status(200).json({
            result: result
        });
    });
});

// Update
Router.put('/page/board', (req,res)=>{
    Page.update({
        _creator: session.user._id,
        _id: req.body.page
    },{
        $push: { _board : req.body.board._id  }
    },function(error, result){
        if( error ) return res.status(500).json({
            errorCode: 500,
            error: error,
            msg: ''
        });
        
        // Session Check
        if( req.session.board ){
            let flag = true;
            for(let i = 0; i < req.session.board.length; i++){
                console.log('', req.session.board[i].community, req.body.board.community )
                if( req.session.board[i].community === req.body.board.community 
                    && req.session.board[i].name === req.body.board.name ){
                        flag = false;
                        break;
                    }
            }
            if( flag ){
                req.session.board.push({
                    community: req.body.board.community,
                    board: req.body.board.name,
                    baseTime: "00:00:00",
                    contents: []
                });
            }
        }
        res.status(200).json({
            result: result
        });
    });
});

// Select
Router.get('/page', (req,res)=>{
    Page.find(
        {   // Condition
            _creator: session.user._id,
        },
        {   // Selector
            _creator: 0, __v: 0
        },
        {   // Option
            sort: { index: 1 }
        }
    ).populate({
        path: '_board'
    }).exec(function(error, pages){
        if( error ) return res.status(500).json({
            errorCode: 500, 
            error: error,
            msg: "Page Find Error"
        });
        return res.status(200).json({
            list: pages
        });
    });
});


module.exports = Router;