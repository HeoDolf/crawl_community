const express = require('express');
const Router = express.Router();

const { Content } = require('./../../models');

// All Content For Home
Router.get('/content/all', (req, res)=>{
    Content.find(null,null,{ sort: { "content.date" : -1 } }, (error, contents)=>{
        if( error ) throw { code: 500, error: error, msg: "Get All-Contents Error" }
        return res.status(200).json({
            length: contents.length,
            list: contents
        });
    })
});

// All Content in Community 
Router.get('/content/:community', (req, res)=>{
    Content.find({
        community: req.params.community
    }
    , null
    , { sort: { "content.date" : -1 }}
    , function( error, contents ){
        if( error ) throw { erroCode: 500, error: error, msg: "Get Community-contents Error"}
        return res.status(200).json({
            lengtH: contents.length,
            lsit: contents
        })
    })
});

// Individual Board Content For Personal
Router.get('/content/:community/:board', (req,res)=>{
    console.log( req.params );
    Content.find({
        community: req.params.community,
        board: req.params.board,
    }
    , null
    , { sort: { "content.date" : -1 } }
    , function( error, contents ){
        if( error ) throw { code: 500, error: error, msg: "Get Board-Contents Error"}
        return res.status(200).json({
            length: contents.length,
            list: contents
        })
    });
});

module.exports = Router;