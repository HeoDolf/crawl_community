const express = require('express');

const Router = express.Router();

Router.get('/crawl/:community/:board', (req,res)=>{
    const community = req.params.community;
    const board= req.params.board;


    res.status(200).json({
        community, board
    })
});

module.exports = Router;