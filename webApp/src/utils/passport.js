const passport      = require("passport"),
      LocalStrategy = require("passport-local").Strategy,
      User          = require("../user/user.model"),
      errors        = require('./errors');


passport.use(new LocalStrategy({
    usernameField: 'username'
}, function (username, password, callback) {
    User.findOne({username}, function (error, user) {

        if (error)
            return callback(error, null, new errors.InternalServerError() );

        if (!user)
            return callback(null, null, new errors.InvalidInput("User not found") );

        if (!user.validPassword(password))
            return callback(null, null, new errors.InvalidInput("Password not match") );

        return callback(null, user, null);
        
    });
}));
