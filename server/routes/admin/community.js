const express = require('express');
const Router = express.Router();

const { Community } = require('./../../models');

// Insert
Router.post('/community', (req,res)=>{
    const commu = new Community({
        name: req.body.name,
        name_kor: req.body.name_kor,
        host: req.body.host,
        pageQuery: req.body.pageQuery,
        startPage: req.body.startPage,
    });
    commu.save(function(error, commu){
        if( error ) return res.status(400).json({
            errorCode: 400,
            error: error
        });
        return res.redirect('/api/community');
    });
});

// Update
Router.put('/community', (req,res)=>{
    Community.update(
        {
            name: { $eq: req.body.name },
        },
        {
            name_kor: req.body.name_kor,
            host: req.body.host,
            pageQuery: req.body.pageQuery,
            startPage: req.body.startPage,
        },
        function(error, raw){
            if( error ) return res.status(400).json({
                errorCode: 400,
                error: error
            });
            return res.redirect('/api/community');
        }
    );
});

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