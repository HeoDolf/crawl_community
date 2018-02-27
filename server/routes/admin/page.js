const express = require('express');
const { Page, Community } = require('./../models');

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
// Find
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
Router.get('/page', (req,res)=>{
    Page.find(function(error, page){
        if( error ) return res.status(500).json({errorCode: 500, error: error });
        return res.status(200).json({
            page
        });
    });
}); 


module.exports = Router;