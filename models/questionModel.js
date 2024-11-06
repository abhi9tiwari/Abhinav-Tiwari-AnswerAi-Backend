const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is mandatory for asking a Quetion"],
        trim : true,
    },
    description: {
        type: String,
        required: [true, "Description is mandatory for asking a Quetion"],
        trim : true,
    },
    answer : {
        type : String,
        trim : true,
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
},{timestamps : true})

module.exports = mongoose.model('question', questionSchema);