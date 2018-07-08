const User     = require('./user.model'),
      passport = require("passport"),
      debug    = require('debug')('User'),
      errors   = require('../utils/errors'); 

/**
 * @api {post} /user/login Login
 * @apiName Login
 * @apiGroup User
 * @apiDescription login to the chatbot maker
 * 
 * @apiParam {String} username
 * @apiParam {String} password
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * 
 * {
        "access_token": "access_token"
        "user": {
            "_id": "_id",
            "name": "admin",
            "username": "admin",
            "email": "admin@admin.com",
            "salt": "salt",
            "hash": "hash",
            "createdAt": "2018-07-04T14:43:14.233Z",
            "updatedAt": "2018-07-04T14:43:14.233Z",
        }
    }
 **/
const login = async( req, res, next ) => {
    passport.authenticate('local', function( error, user, info ){
        if ( error )
            return next( new errors.InternalServerError() );
        if ( user ){
            const token = user.generateJwt();
            return res.send({ access_token: token, user });
        } else 
            return next( new errors.Unauthorized() );
    })(req, res, next);
};

let setupIsDone = false;

/**
 * @api {get} /user/setup Setup Admin Account
 * @apiName Setup Admin Account
 * @apiGroup User
 * @apiDescription set up the default admin account, the API can call once only
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * 
 **/
const setup = async ( req, res, next ) => {
    
    if ( setupIsDone )
        return res.send('OK');

    let admin = new User({
        name     : 'admin',
        username : 'admin',
        email    : 'admin@admin.com',
        role     : 'Admin'
    });
    admin.setPassword( process.env.DEFAULT_PASSWORD || 123456 );
    admin = await admin.save();
    return res.send('OK');
};

User
    .findOne({ name: 'admin' })
    .then( result => {
        if ( result )
            setupIsDone = true;
    });

module.exports = { login, setup };