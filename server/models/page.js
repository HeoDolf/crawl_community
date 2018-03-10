const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('page', new Schema(
    {
        title: String,
        _creator: { type: Schema.Types.ObjectId, ref: 'member' },
        _board: [{type: Schema.Types.ObjectId, ref: 'board'}],
        index: { type: Number, default: -1 },
        display: { type: Number, enum:[0,1], default: 1 },          // 0 none, 1 show
        layout: {
            type: String, 
            enum : ['vertical', 'horizontal'], 
            default: 'vertical' 
        },
        regDate: { type: Date, default: Date.now }
    },
    {
        collection: 'page'
    }
));