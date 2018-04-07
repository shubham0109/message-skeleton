const express = require('express');
const bodyParser = require('body-parser');
let route = require('./routes/routes');
let mongoose = require('mongoose');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let passwordHash = require('password-hash');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let flash = require('connect-flash');

const app = express();
const port = process.env.PORT || 3000;

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000*60 },resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// mongoose schema
let User = require('./model/model.js');
//console.log(User);
mongoose.connect("mongodb://shubham0109:shubham@ds123619.mlab.com:23619/database1");


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});


// login passport config
passport.use('login',new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done){
        console.log("in passport login");
        User.findOne({username: username}, function(err, user){
            if (err) {return done(err)}

            if (!user){
                console.log("incorrect username");
                return done(null, false, req.flash("message", "Incorrect username"))
            }

            if (!user.verifyPassword(password)){
                console.log("incorrect password");
                return done(null, false, req.flash("message", "Incorrect password"));
            }

            return done(null, user);
        });
    }
));


// register passport config
passport.use('register', new LocalStrategy({
        passReqToCallback: true
    },
    function(req, username, password, done){
        console.log("here");
        User.findOne({username: username}, function(err, user){
            if (err) {return done(err)}

            if (user){
                console.log("user exists");
                return done(null, false, req.flash("message", "User exists"));
            }else {
                let newUser = new User();
                newUser.username = username;
                newUser.password = newUser.generatePassword(password);
                newUser.firstname = req.body.firstname;
                newUser.lastname = req.body.lastname;

                newUser.save(function(err){
                    if (err){
                        console.log(err);
                    }else {
                        console.log("succesfully added")
                    }
                });
                return done(null, newUser);
            }
            
        });
    }
));
app.use('/', route);
//require('./routes/routes.js')(app, passport);
app.listen(port, () => {
    console.log(`listening at ${port}`);
});

