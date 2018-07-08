const mongoose = require("mongoose"),
      crypto   = require("crypto"),
      jwt      = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name            : { type: String, required: true },
    username        : { type: String, required: true, unique: true },
    email           : { type: String},
    hash            : String,
    salt            : String,
    profile_image   : String
}, { timestamps: true });

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, process.env.DIGEST_NAME).toString('hex');
};

userSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, process.env.DIGEST_NAME).toString("hex");
    return this.hash == hash;
};

userSchema.methods.generateJwt = function () {
    return jwt.sign( {
        _id : this._id,
        name : this.name,
        userSchema : this.username,
        email : this.email
    }, process.env.SECRET_KEY);
};

userSchema.statics.get = function( userId ){
    return this.findById(userId);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

