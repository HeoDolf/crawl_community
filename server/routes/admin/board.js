const express = require('express');
const Router = express.Router();

const { Community, Board } = require('./../../models');

// Find
Router.get('/board', (req,res)=>{
    Board.find((error, board)=>{
        if( error ) return res.status(500).json({errorCode: 500, error: error});
        return res.status(200).json({
            board
        });
    });
});

module.exports = Router;