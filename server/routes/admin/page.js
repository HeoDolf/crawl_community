const express = require('express');
const { Page, Community } = require('./../../models');

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