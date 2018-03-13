const express = require('express');
const Router = express.Router();

const { Content } = require('./../../models');

// All Content For Home
Router.get('/content/all', (req, res)=>{
    Content.find()
    .sort({ "content.date" : -1 })
    .limit(10)
    .exec(function( error, contents ){
        if( error ) throw { code: 500, error: error, msg: "Get All-Contents Error" }
        return res.status(200).json({
            length: contents.length,
            list: contents
        });
    });
});

// All Content in Community 
Router.get('/content/:community', (req, res)=>{
    Content.find({
        community: req.params.community
    })
    .sort({ "content.date" : -1 })
    .limit(10)
    .exec(function( error, contents ){
        if( error ) throw { erroCode: 500, error: error, msg: "Get Community-contents Error"}
        return res.status(200).json({
            lengtH: contents.length,
            lsit: contents
        })
    });
});

// Individual Board Content For Personal
Router.get('/content/:community/:board/', (req,res)=>{
    Content.find({
        community: req.params.community,
        board: req.params.board,
    })
    .sort({ "content.date" : -1 })
    .limit(10)
    .exec(function( error, contents ){
        if( error ) throw { code: 500, error: error, msg: "Get Board-Contents Error"}
        return res.status(200).json({
            length: contents.length,
            list: contents
        })
    });
    // .skip((page-1)*2).limit(2);
});
Router.get('/content/:community/:board/:lastContent', (req,res)=>{
    Content.find({
        community: req.params.community,
        board: req.params.board,
        "content.no": { $lt: parseInt( req.params.lastContent ) }
    })
    .sort({ "content.date" : -1 })
    .limit(10)
    .exec(function( error, contents ){
        if( error ) throw { code: 500, error: error, msg: "Get Board-Contents Error"}
        return res.status(200).json({
            length: contents.length,
            list: contents
        })
    });
});



module.exports = Router;