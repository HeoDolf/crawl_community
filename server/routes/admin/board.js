const express = require('express');
const Router = express.Router();

const { Community, Board } = require('./../../models');

// Insert
Router.post('/board', (req,res)=>{
    Community.findOne({name:req.body.community}, function(error, community){
        if( error ) return res.status(500).json({errorCode: 500, error: error});
        const board = new Board({
            _community: community._id,
            uri: req.body.uri,
            name: req.body.name,
            name_kor: req.body.name_kor,
            withLogin: req.body.withLogin,
            intervalTime: req.body.intervalTime,
        });
        board.save(function(error, commu){
            if( error ) return res.status(500).json({errorCode: 500, error: error});
            return res.redirect('/api/board');
        });
    });
});

// Update
Router.put('/board', (req,res)=>{
    Community.findOne( {name: req.body.name}, function(error, community){
        Board.update(
            {
                name: req.body.name,
                _community: community._id
            },
            {
                uri: req.body.uri,
                name_kor: req.body.name_kor,
                withLogin: req.body.withLogin,
                intervalTime: req.body.intervalTime,
            },
            function(error, raw){
                if( error ) return res.status(500).json({
                    errorCode: 500,
                    error: error
                });
                return res.redirect('/api/board');
            }
        );
    })
});

// Find
Router.get('/board', (req,res)=>{
    Board.find((error, board)=>{
        if( error ) return res.status(500).json({errorCode: 500, error: error});
        return res.status(200).json({
            board
        });
    });
});

Router.get('/board/:community', (req,res)=>{
    Community.findOne(
        {
            name: req.params.community
        }, 
        function(error, community){
            if( error ) return res.status(500).json({
                errorCode: 500, 
                error: error,
                community,
                msg: "Community Find Error"
            });

            Board.find(
                {
                    _community: community._id
                },
                {
                    _id: 0, name: 1, name_kor: 1, intervalTime: 1, uri: 1
                },
                function(error, boards){
                    if( error ) return res.status(500).json({
                        errorCode: 500,
                        error: error,
                        msg: "Board Find Error"
                    });
                        
                    return res.status(200).json({
                        list: boards 
                        // list: boards.slice(0,1) 
                    });
                }
            )
        }
    )
});
module.exports = Router;