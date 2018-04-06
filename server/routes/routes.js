const express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => {
    // starting / landing page
    res.send("starting page!!");
    console.log("starting");
});

router.get('/inbox', (req, res, next) => {
    // return all messages 
});

router.post('/login', (req, res, next) => {
    // log in the user and authenticate the user
});

router.post('/register', (req, res, next) => {
    // sign-in form and store the information for further authentication
});

router.post('/sendmessage', (req, res, next) => {
    // compose the message and send it to the reciepient 
});

router.put('/block/username', (req, res, next) => {
   // block the user
});

module.exports = router;