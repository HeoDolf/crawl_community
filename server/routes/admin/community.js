const express = require('express');
const Router = express.Router();

const { Community } = require('./../../models');

// Find
Router.get('/community', (req,res)=>{
    const withBoard = req.query.withBoard;

    Community.find().populate({ path:'board' }).exec((error, community)=>{
            if( error ) return res.status(500).json({
                errorCode: 500,
                error: error,
                msg: 'Get Community Error'
            });
    
            return res.status(200).json({
                list: community
            });
    })
});

// Delete
Router.delete('/community', (req,res)=>{
    res.redirect('/api/community');
});

module.exports = Router;