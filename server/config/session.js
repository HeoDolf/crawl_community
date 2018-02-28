const session = require('express-session');
module.exports = session({
    secret: "dolf@@c(*@_ASD",
    resave: false,
    saveUninitialized: true
});