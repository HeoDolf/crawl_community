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
            index: req.body.index
        });
        page.save(function(error, page){
            if( error ) return res.status(500).json({errorCode: 500, error: error });
            res.redirect('/api/page');
        });
    });
});
Router.get('/page/:index/:community', (req,res)=>{
    Community.findOne(
        { 
            name: req.params.community
        }, 
        function(error, community){
            if( error ) return res.status(500).json({errorCode: 500, error: error});
            Board.find({
                _community: community._id
            },null,{
                select: "_id"
            }, function(error, boards){
                if( error ) return res.status(500).json({errorCode: 500, error: error});
                
                Page.update(
                    { 
                        index: req.params.index
                    },
                    {
                        $set: { 
                            _board: boards.map((board)=>{
                                return board.id;
                            })
                        }
                    },
                    function(error, success){
                        if( error ) return res.status(500).json({errorCode: 500, error: error});
                        return res.status(200).json({
                            success,
                            boards: boards.map((board)=>{
                                return board.id;
                            })
                        })
                    });
            });
        }
    );
});
// Find One
Router.get('/page/:title', (req,res)=>{
    Page.findOne({
            title:req.params.title, 
            _creator:session.user._id
        })
        .populate({ path:'_community' })
        .exec(function(error, page){
            if( error ) return res.status(500).json({errorCode: 500, error: error });
            return res.status(200).json({
                page
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