const LoclaStrategy = require('passport-local').Strategy;
let User = require('../models/user');
let database = require('../config/database');
let bcrypt = require('bcryptjs');
// const passport = require('passport');
module.exports=function(passport){
    passport.use(new LoclaStrategy(function(username,password,done){
        let query = {username:username};
        User.findOne(query,function(err,user){
            if(err) throw err
            if(!user){
                return done(null,false,{message:'No user found'});
            }else{
                bcrypt.compare(password,user.password,function(err,ismatch){
                    if(err) throw err
                    if (ismatch)
                    {
                        return done(null,user)
                    }else{
console.log(user);
                        return done(null,false,{message:'password doesnt match'});
                    }
                });
            }
        });
    }));

    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
};