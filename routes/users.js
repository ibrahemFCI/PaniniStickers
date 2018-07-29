const mongoose = require('mongoose');
let express = require('express');
let bcrypt = require('bcryptjs');
const router = express.Router();
let User = require('../models/user');
let UserImages = require('../models/user_images');
const passport = require('passport');





router.get('/register',function(req,res){
    res.render('register',{
        title: 'Registeration form'
    });
});



router.post('/register',function(req,res){
    req.checkBody('name','name is required').notEmpty();
    req.checkBody('username','username is required').notEmpty();
    req.checkBody('email','email is required').notEmpty();
    req.checkBody('email','email is not valid').isEmail();
    req.checkBody('password','password is required').notEmpty();
    req.checkBody('password2','password2 is required').notEmpty();
    req.checkBody('password2','passwords not matched').equals(req.body.password);
    let errors=req.validationErrors();
    if(errors){
        res.render('register',{
            title: 'Registeration form',
            errors:errors
        });

    }else{
        let user = new User();
        user.name=req.body.name;
        user.username=req.body.username;
        user.email=req.body.email;
        user.password=req.body.password;
        bcrypt.genSalt(10,function(err,salt){
            if(err) throw err
            bcrypt.hash(user.password,salt,function(err,hash){
                if(err) throw err
                user.password=hash;
                user.save(function(err,user){
                    if(err) throw err
                    let user_images = new UserImages();
                    user_images.book_id = '5b4f0fa356f1fa4d197a79df';
                    user_images.user_id=user._id
                    user_images.user_collection=[];
                    user_images.user_double=[];
                    user_images.save(function(err){
                        if(err) throw err 
                    req.flash('success','User Registred');
                    res.redirect('/users/login');
                    });
                });
            });
        });

    }


});

router.get('/login',function(req,res){
    res.render('login');
});


router.post('/login',function(req,res,next){
    var redirectTo = req.session.redirectTo ? req.session.redirectTo : '/';
    passport.authenticate('local',{
        successRedirect: redirectTo,
        failureRedirect: '/users/login',
        failureFlash: true 
    })(req,res,next)


});

router.get('/logout',function(req,res){
    
    req.logout();
    req.flash('success','you are logged out');
    res.redirect('/users/login')
});

router.get('/:id',function(req,res){
    User.findById(req.params.id,function(err,user){
        if (err) throw err
            if(user){
                // console.log(user)
            res.json(user);
        }
        else
        {
            res.render('article',{
                article: article,
                author:article.author
            });

        }
        });



    });
    



module.exports=router;