const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model("board", new Schema(
    {
        _community: { type: Schema.Types.ObjectId, ref: 'community' },
        uri: String,
        name: String,
        name_kor: String,
        withLogin: { type: Number, enum:[0,1], default: 0 },
        intervalTime: { type: Number, default: 1 },
        regDate: { type: Date, default: Date.now }
    },
    {
        collection: 'board'
    }
));