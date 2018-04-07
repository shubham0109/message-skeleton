const express = require('express');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let router = express.Router();
let User = require('../model/model.js');

//function Router(router, passport){
router.get('/', (req, res) => {
    // starting / landing page
    res.redirect('/login');
    console.log("starting");
});

router.get('/inbox', isActive, (req, res) => {
    // return all messages 
    console.log("inside inbox");
    let username = req.username;
    console.log("session: ", req.session.passport.user);
    let msgArray = [];
    User.findById(req.session.passport.user, function(err, user){
        if (err){
            console.log("error");
            return err;
        }
        else if (!user){
            console.log("no user");
        }
        else {
            let messages = user.messages;
            console.log(messages);
            for (let i = 0; i < messages.length; i++){
                msgArray.push(messages[i]);
                console.log(i);
            }

        }
        console.log(msgArray);
        res.render('inbox.ejs', {msgArray: msgArray});
    });
    
});

router.post('/login', passport.authenticate('login', {
    successRedirect:'/inbox',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/login', function(req, res) {

    res.render('login.ejs', { message: req.flash('message') });
});

router.get('/home', isActive, (req, res) => {
    console.log("in home");
    res.render('home.ejs');
});

router.post('/register', passport.authenticate('register', {
    successRedirect:'/home',
    failureRedirect: '/register',
    failureFlash: true
}));

router.get('/register', function(req, res) {
    res.render('register.ejs', { message: req.flash('message') });
});

router.post('/sendmessage', isActive, (req, res) => {
    // compose the message and send it to the reciepient 
    let username = req.body.recievername;
    let messageText = req.body.messagetext;
    let messageSubject = req.body.messagesubject;
    let sendername = req.body.username;
    console.log("sender: ", sendername);
    User.findOne({username: username}, function(err, user){
        if (err){
            console.log("error");
            return err;
        }
        else if (!user){
            console.log("no user");
        }
        else {
            let blockedArray = user.isblocked;
            for (i in blockedArray){
                if (sendername === i){
                    console.log("You are blocked");
                    return;
                }
            }
            user.messages.push({
                subject: messageSubject,
                text: messageText
            });
            user.save();
            console.log("message sent!");
        }
    });
    res.render('compose.ejs');
});

router.get('/sendmessage', function(req, res) {
    res.render('compose.ejs');
});

router.put('/block', isActive, (req, res) => {
   // block the user
    console.log("inside block ");
    let username = req.blockname;
    console.log("session: ", req.session.passport.user);
    User.findById(req.session.passport.user, function(err, user){
        if (err){
            console.log("error");
            return err;
        }
        else if (!user){
            console.log("no user");
        }
        else {
            user.isblocked.push(username);
            user.save();
            console.log("user blocked");
        }
        res.redirect('/inbox');
    });
});

router.post('/block', isActive, (req, res) => {
    // block the user
     console.log("inside block post");
     let username = req.body.blockname;

     console.log("session: ", req.session.passport.user);
     User.findById(req.session.passport.user, function(err, user){
         if (err){
             console.log("error");
             return err;
         }
         else if (!user){
             console.log("no user");
         }
         else {
             user.isblocked.push(username);
             user.save();
             console.log("user blocked");
         }
         res.redirect('/inbox');
     });
 });

router.get('/block', isActive, (req, res) => {
    res.render('block.ejs');
})

function isActive(req, res, next) {
 
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

module.exports = router;