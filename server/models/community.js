const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('community', new Schema(
    {
        name: { type: String, unique: true },
        name_kor: String,
        host: String,
        pageQuery: { type: String, default: "?page="},
        startPage: { type: Number, default: 1 },
        regDate: { type: Date, default: Date.now },
    },
    {
        collection: "community"
    }
));