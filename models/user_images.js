const mongoose = require('mongoose');


let userimageschema = mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    book_id:{
        type:String,
        required:true
    },
    user_collection:{
        type:[String],
        required:true
    },
    user_double:{
        type:[String],
        required:true
    },
});


let userimages = module.exports = mongoose.model('UserImage',userimageschema);