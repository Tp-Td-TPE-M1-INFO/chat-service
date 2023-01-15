const  mongoose = require('mongoose');

const messageModel = mongoose.Schema(
    {
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            require: true
        },
        content:{
            type: String, 
            trim: true
        },
        chat:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat"
        },
        date:{
            type: String,
            default: Date.now(),
        }
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model('Message', messageModel);

module.exports = Message;