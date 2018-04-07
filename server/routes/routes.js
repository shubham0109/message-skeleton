const express = require('express');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let router = express.Router();
let User = require('../model/model.js');


router.get('/', (req, res) => {
    // starting / landing page
    res.redirect('/login');
    console.log("starting");
});

router.get('/inbox', isActive, (req, res) => {
    // return all messages 
    console.log("inside inbox");
    //let username = req.username;
    //console.log("session: ", req.session.passport.user);

    let msgArray = [];
    // getting the id of the user from the session and then finding the user in database
    let id = req.session.passport.user;
    User.findById(id, function(err, user){
        if (err){
            console.log("error");
            return err;
        }
        else if (!user){
            console.log("no user");
        }
        else {
            // getting all the  messages and then printing them
            let messages = user.messages;
            //console.log(messages);
            for (let i = 0; i < messages.length; i++){
                msgArray.push(messages[i]);
                //console.log(i);
            }

        }
        //console.log(msgArray);

        // finally rendering the inbox.ejs and passing all the messages as a parameter
        res.render('inbox.ejs', {msgArray: msgArray});
    });
    
});

// LOGIN ROUTES
// POST request on login will pass through a passport middleware which authenticates the data
router.post('/login', passport.authenticate('login', {
    successRedirect:'/inbox',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/login', function(req, res) {
    res.render('login.ejs', { message: req.flash('message') });
});

// REGISTER ROUTES
// POST request on register will pass through a passport middleware which authenticates and saves the data
router.post('/register', passport.authenticate('register', {
    successRedirect:'/inbox',
    failureRedirect: '/register',
    failureFlash: true
}));

router.get('/register', function(req, res) {
    res.render('register.ejs', { message: req.flash('message') });
});

// SENDMESSAGE ROUTES
// isActive() acts as a middleware to check for sessions
router.post('/sendmessage', isActive, (req, res) => {
    // compose the message and send it to the reciepient 
    let username = req.body.recievername;
    let messageText = req.body.messagetext;
    let messageSubject = req.body.messagesubject;
    let sendername;

    // get sendername by using the session
    User.findById(req.session.passport.user, function(err, user){
        if (err){
            console.log("error");
            return err;
        }
        else if (!user){
            console.log("no user");
        }
        else {
            sendername = user.username;
            //console.log("sender: ", sendername);
            
            // Once sendername is received we check if the user's blockedlist contains sender's name
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
                  //  console.log("arr: ", blockedArray);

                    // check for sender name in blockedlist
                    for (let i = 0; i < blockedArray.length; i++){
                        if (sendername === blockedArray[i]){
                            // if found return
                            console.log("You are blocked");
                            return;
                        }
                    }

                    // Push the message into the database
                    user.messages.push({
                        subject: messageSubject,
                        text: messageText
                    });
                    user.save();
                    console.log("message sent!");
                }
            });
        }
    });
    
    res.render('compose.ejs');
});

router.get('/sendmessage', function(req, res) {
    res.render('compose.ejs');
});


// BLOCK ROUTES
router.put('/block', isActive, (req, res) => {
   // block the user
    console.log("inside block ");
    let username = req.blockname;
    console.log("session: ", req.session.passport.user);

    // find the user and push the blocked user username into it's blocked list
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


// a middleware that's used for authentication
function isActive(req, res, next) {
 
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}

module.exports = router;