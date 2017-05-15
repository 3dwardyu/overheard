var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    local:  {
        email: String,
        password: String
    },
    twitter:  {
        id: String,
        token: String,
        username: String,
        displayName: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },

    instagram: {
        id: String,
        token: String,
        username:String,
        name: String
    }
});


//method to generate hash
userSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checks if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);