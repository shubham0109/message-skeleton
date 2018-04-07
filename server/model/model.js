let mongoose = require('mongoose');
let passwordHash = require('password-hash');

let schema = new mongoose.Schema({
    username: String, 
    password: String, 
    firstname: String, 
    lastname: String,
    isblocked: [String],
    messages:[{
        subject: String,
        text: String
    }]
});
schema.methods.generatePassword = function (password) {
    return passwordHash.generate(password);
}
schema.methods.verifyPassword = function (password) {
    return passwordHash.verify(password, this.password);
}
module.exports = mongoose.model('User', schema);