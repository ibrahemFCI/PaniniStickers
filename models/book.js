const mongoose = require('mongoose');


let countryschema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    players_no:{
        type:Number,
        required:true
    },
});

let bookschema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    countries:{
        type:[countryschema],
        required:true
    },
});

let Book = module.exports = mongoose.model('Book',bookschema);