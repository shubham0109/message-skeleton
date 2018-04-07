# message-skeleton
A test skeletal RESTful Api for a simple messaging app with authentication

live app: https://young-chamber-99623.herokuapp.com/login <br/>
postman documentation: https://documenter.getpostman.com/view/4094712/RVu4Gpt8

This is a very simple app with the following functionality:
- logging the user
- if a new user, register him/her
- show the user his inbox
- enable the user to send messages to other users
- block a particular user if need be

Once the user logs in, a session for him is created. Once inside the session, the user can use any functionality.
The session logs out in 60 minutes or if the user closes his window.
Passport.js has been used to achieve this along with the authentication.Mongoose is used for saving the data in the database.
If the data is a password then it is hashed and stored.
Connect flash is used for flash messages. 

Stack Used:
- Mongo
- Node 
- Express

Libraries Used:
- Passport
- Mongoose
- password-hash
- ejs
- cookie-parser
- connect-flash etc,

mlabs is used for hosting the mongo data
