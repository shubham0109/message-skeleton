const express = require('express');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let router = express.Router();

router.get('/', (req, res, next) => {
    // starting / landing page
    res.send("starting page!!");
    console.log("starting");
});

router.get('/inbox', (req, res, next) => {
    // return all messages 
});

router.post('/login', passport.authenticate('login', {
    successRedirect:'/inbox',
    failureRedirect: '/register',
    failureFlash: true
}));

router.post('/register', passport.authenticate('register', {
    successRedirect:'/inbox',
    failureRedirect: '/register',
    failureFlash: true
}));

router.post('/sendmessage', (req, res, next) => {
    // compose the message and send it to the reciepient 
});

router.put('/block/username', (req, res, next) => {
   // block the user
});

module.exports = router;