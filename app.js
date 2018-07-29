let express = require('express');
const app= express();
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const database = require('./config/database');
const passport = require('passport');
const bodyParser = require('body-parser');
const intersection = require('array-intersection');
const difference = require('array-difference');
const socket = require('socket.io');
let User = require('./models/user');
let Book = require('./models/book');
let UserImage = require('./models/user_images');
let bookID = '5b4f0fa356f1fa4d197a79df';
mongoose.connect(database.database);
let db = mongoose.connection;

db.once('open',function(){
    console.log('connected to db');
});
 
db.on('error',function(err){
    console.log(err);
})


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

app.use(express.static(path.join(__dirname,'public')));

app.use(expressValidator());
//express session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true }
  }));

//express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});




require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.get('*',function(req,res,next){
res.locals.user = req.user || null;
next();
});


app.get('/',ensureAuthentiction,function(req,res){

    // let book = new Book();
    //     book.name = "test";
    //     book.countries = [
    //         {
    //             name:"Egypt",
    //             players_no:20
    //         },
    //         {
    //             name:"KSA",
    //             players_no:20
    //         },
    //         {
    //             name:"Russia",
    //             players_no:20
    //         },
    //         {
    //             name:"England",
    //             players_no:20
    //         },
    //         {
    //             name:"Portogal",
    //             players_no:20
    //         },
    //     ];
    //     book.save(function(err){
    //         if(err) throw err
    //         req.flash('success','book Added');
            
    //     });

        // 5b316838ed6bd62e643c7760
        Book.findById(bookID,function(err,book){
            if (err) throw err
                // console.log(book);
                UserImage.findOne({book_id:bookID,user_id:req.user._id},function(err,user_images){
                    if(err) throw err
                    // console.log(user_images.user_collection);
                    res.render('index',{
                    book: book,
                    user_images:user_images.user_collection
                }); 
    
                });
                
    
        });

});

app.get('/collection',ensureAuthentiction,function(req,res){

    Book.findById(bookID,function(err,book){
        if (err) throw err
            // console.log(book);
            UserImage.findOne({book_id:bookID,user_id:req.user._id},function(err,user_images){
                if(err) throw err
                console.log(user_images.user_collection);
                res.render('index',{
                book: book,
                user_images:user_images.user_collection
            }); 

            });
            

    });

});

app.post('/collection',ensureAuthentiction,function(req,res){

            let User_image = {};
            // book_id'5b316838ed6bd62e643c7760',user_id:user._id
            User_image.user_collection=req.body.images;
            // User_image.author=req.user._id;
            // User_image.body=req.body.body;
            let query={book_id:bookID,user_id:req.user._id};
            UserImage.update(query,User_image,function(err,collection){
                if(err) throw err
                req.flash('success','Collection Updated');
               
                res.redirect('/collection');

            });
            // // User_image.save(function(err){
            // //     if(err) throw err
            // //     req.flash('success','Article Added');
            // //     res.redirect('/');
            // // });
        

            // let article = {}
            // article.title=req.body.title;
            // article.author=req.user._id;
            // article.body=req.body.body;
            // let query={_id:req.params.id};
            // Article.update(query,article,function(err){
            //     if(err) throw err
            //     req.flash('success','Article Updated');
            //     res.redirect('/');
            // });
    
    
    
});



app.get('/doubles',ensureAuthentiction,function(req,res){

    Book.findById(bookID,function(err,book){
        if (err) throw err
            // console.log(book);
            UserImage.findOne({book_id:bookID,user_id:req.user._id},function(err,user_images){
                if(err) throw err
                console.log(user_images.user_collection);
                res.render('doubles',{
                book: book,
                user_images:user_images.user_double
            }); 

            });
            

    });

});

app.post('/doubles',ensureAuthentiction,function(req,res){

            let User_image = {};
            User_image.user_double=req.body.images;
            let query={book_id:bookID,user_id:req.user._id};
            UserImage.update(query,User_image,function(err,collection){
                if(err) throw err
                req.flash('success','Doubles Updated');
               
                res.redirect('/doubles');

            });
    
    
    
});

// app.get('/doubles',ensureAuthentiction,function(req,res){

//     Book.findById('5b316838ed6bd62e643c7760',function(err,book){
//         if (err) throw err
//             console.log(book);
//             res.render('index',{
//                 book: book
//             }); 

//     });

// });

app.get('/trade',ensureAuthentiction,function(req,res){

    Book.findById(bookID,function(err,book){
        if (err) throw err
            // console.log(book);
            UserImage.findOne({book_id:bookID,user_id:req.user._id},function(err,user_images){
                if(err) throw err
                console.log(user_images.user_collection);
                res.render('trade',{
                book: book,
                user_doubles:user_images.user_double,
                user_collections:user_images.user_collection,
            }); 

            });
            

    });

});


app.get('/search',ensureAuthentiction,function(req,res){

    Book.findById(bookID,function(err,book){
        if (err) throw err
            // console.log(book);
            UserImage.findOne({book_id:bookID,user_id:req.user._id},function(err,user_images){
                if(err) throw err
                // console.log(user_images.user_collection);
                res.render('search',{
                book: book,
                user_doubles:user_images.user_double,
                user_collections:user_images.user_collection,
            }); 

            });
            

    });

});

app.post('/search',ensureAuthentiction,function(req,res){

            // let User_image = {};
            let relevant_users = [];
            let search_images = req.body.images;
            let user_doubles2 = req.body.userdoubles;
            let query={book_id:bookID,user_id: {$ne: req.user._id}};
            UserImage.find(query,function(err,users){
                if(err) throw err
                // console.log(users.length);
                var counter = 0;
                users.forEach(user_images => {
                    counter++;
                    let images_intersection = intersection(search_images,user_images.user_double);
                    // console.log(user_doubles);
                    let images_difference = arr_diff(user_doubles2,user_images.user_double);

                    images_difference = arr_diff(images_difference,user_images.user_collection);

                    if (images_intersection.length>0)
                    {
                    
                            relevant_users.push({
                                user_id: user_images.user_id,
                                user_images:images_intersection,
                                user_needs:images_difference,
                                images_counter:images_intersection.length
                        });
                        
                        
                    }

                });
                relevant_users.sort(dynamicSort("-images_counter"));
                res.json(relevant_users); 


            });
});



function ensureAuthentiction(req,res,next){
    if(req.isAuthenticated())
    {
        return next();

    }else{

        req.flash('danger','Please Login');
        req.session.redirectTo = req.path;
        res.redirect('/users/login');
    }
}



function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

let users=require('./routes/users');
app.use('/users',users);
var server = app.listen(3000,function(){
    console.log('server started on port 3000 ...');
});

var sio = socket(server);
sio.on('connection',function(visitor){
    
        console.log(visitor.id);
        visitor.on('send_new_message',function(data){
            {
                console.log(data); 
                sio.sockets.connected[data.to].emit('new_message',data);
            }
        });
});


function arr_diff (a1, a2) {

    var a = [], diff = [];

    for (var i = 0; i < a1.length; i++) {
        a[a1[i]] = true;
    }

    for (var i = 0; i < a2.length; i++) {
        if (a[a2[i]]) {
            delete a[a2[i]];
        } 
    }

    for (var k in a) {
        diff.push(k);
    }

    return diff;
}

sio.use(function(visitor,next){
visitor['id'] = visitor.handshake.query.userid;
next();
});

