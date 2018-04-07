const express = require('express');
const bodyParser = require('body-parser');
let route = require('./routes/routes');
let mongoose = require('mongoose');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

// mongoose schema
let schema = new mongoose.Schema({username: 'string', password: 'string', firstname: 'string', lastname: 'string'});
let User = mongoose.model('User', schema);
mongoose.connect("mongodb://shubham0109:shubham@ds123619.mlab.com:23619/database1");

// login passport config
passport.use('login',new LocalStrategy(
    function(username, password, done){
        User.findOne({username: username}, function(err, user){
            if (err) {return done(err)}

            if (!user){
                return done(null, false, {messae : "Incorrect username"})
            }

            if (!user.validPassword(password)){
                return done(null, false, { message: 'Incorrect password' });
            }

            return done(user);
        });
    }
));


// register passport config
passport.use('register', new LocalStrategy(
    function(username, password, done){
        console.log("here");
        User.findOne({username: username}, function(err, user){
            if (err) {return done(err)}

            if (user){
                console.log("user exists");
                return done(null, false, {message : "Incorrect username"})
            }else {
                let newUser = new User();
                newUser.username = username;
                newUser.password = password;
            //    newUser.firstname = firstname;
            //    newUser.lastname = lastname;

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


const app = express();
const port = process.env.PORT || 3000;

app.use('/', route);

app.listen(port, () => {
    console.log(`listening at ${port}`);
});

