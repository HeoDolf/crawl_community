const mongoose = require('mongoose');

const db = mongoose.connection;
db.on('error', console.error );
db.once('open', function(){
    console.log('[connected to mongod server]');
});

mongoose.connect('mongodb://localhost/my_coms');
// mongoose.connect('mongodb://username:password@host:port/database?options...');

module.exports = mongoose;