var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
    local:  {
        email: String,
        password: String
    },
    twitter:  {
        id: String,
        token: String,
        email: String,
        name: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }
});

//method to generate hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.compareSync(password, bcrypt.genSaltSync(8), null);
};

// checks if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.conpareSync(pass, this.local.password);
};

module.exports = mongoose.model('User', userSchema);