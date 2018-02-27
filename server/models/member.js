const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('member', new Schema(
    {
        username: {
            type: String,
            trim: false,
            unique: true,
            match: /^[a-zA-Z]{1}[a-zA-Z0-9]{4,12}$/
        },
        password: {
            type: String,
            trim: false,
            match: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/
        },
        nickname: {
            type: String,
            trim: false,
            match: /^[a-zA-Z0-9가-힣]{2,12}$/
        },
        email: {
            type: String,
            trim: false,
            match: /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
        },
        status: { type: Number, enum:[0,1,2,3], default: 0 },
        regDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        collection: "member"
    }
));