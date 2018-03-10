const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model("board", new Schema(
    {
        community: {
            name: String,
            name_kor: String,
        },
        uri: String,
        name: String,
        name_kor: String,
        withLogin: { type: Number, enum:[0,1], default: 0 },
        intervalTime: { type: Number, default: 1 },
        lastUpdate: Date,
        regDate: { type: Date, default: Date.now }
    },
    {
        collection: 'board'
    }
));