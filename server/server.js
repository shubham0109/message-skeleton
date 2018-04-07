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
app.use(cookieParser());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 },resave: true, saveUninitialized: true}));
app.use(flash());
app.use('/', route);
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


// mongoose schema
let schema = new mongoose.Schema({username: 'string', password: 'string', firstname: 'string', lastname: 'string'});
schema.methods.generatePassword = function (password) {
    return passwordHash.generate(password);
}
schema.methods.verifyPassword = function (password) {
    return passwordHash.verify(password, this.password);
}
let User = mongoose.model('User', schema);
mongoose.connect("mongodb://shubham0109:shubham@ds123619.mlab.com:23619/database1");

// login passport config
passport.use('login',new LocalStrategy({
        passReqToCallback: true
    },
    function(username, password, done){
        User.findOne({username: username}, function(err, user){
            if (err) {return done(err)}

            if (!user){
                return done(null, false, {messae : "Incorrect username"})
            }

            if (!user.verifyPassword(password)){
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(user);
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
                return done(null, false, req.flash({message : "User exists"}));
            }else {
                let newUser = new User();
                newUser.username = username;
                newUser.password = newUser.generatePassword(password);
                newUser.firstname = req.firstname;
                newUser.lastname = req.lastname;

                newUser.save(function(err){
                    if (err){
                        console.log(err);
                    }else {
                        console.log("succesfully added")
                    }
                });
                return done(newUser);
            }
            
        });
    }
));


app.listen(port, () => {
    console.log(`listening at ${port}`);
});

