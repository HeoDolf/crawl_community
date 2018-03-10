const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const ContentSchema = new Schema(
    {
        community: String,
        board: String,
        content: {
            no: String,
            title: String,
            writer: String,
            url: String,
            date: Date,
            date_arr: [{type:String}],
        },
        regDate: { type: Date, default: Date.now }
    },
    {
        collection: 'content'
    }
);

// 이건 Save할 때만 적용됨ㅠㅠ
// insert는 MiddleWare가 적용이 안됨
// autoIncrement.initialize(mongoose.connection);
// ContentSchema.plugin(autoIncrement.plugin, {model: 'content', field: 'index', startAt: 1});

module.exports = mongoose.model('content', ContentSchema);