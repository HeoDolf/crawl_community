const express = require('express');
const Router = express.Router();

// Login
Router.post('/auth/sign', (req, req)=>{
    res.end();
});
// Logout
Router.get('/auth/sign', (req, res)=>{
    res.end();
});

// Regsiter
Router.post('/auth/signup', (req, res)=>{
    res.end();
});

// Update
Router.put('/auth/member', (req, res)=>{
    res.end();
});

// Delete
Router.delete('/auth/member', (req, res)=>{
    res.end();
});


module.exports = Router;