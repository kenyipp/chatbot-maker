const express = require('express'),
      path    = require('path'),
      util    = require('util'),
      debug   = require('debug')('Server:root'),
      errors  = require('./utils/errors');

const App = function(){
    
    require('dotenv').config();
    require("./utils/passport");

    const app = express();
    
    function mountDatabase(){
        const mongoose = require("mongoose");
        mongoose.Promise = require('bluebird');
        mongoose.connect(process.env.MONOGO_URI, { useNewUrlParser: true });
        mongoose.connection.on("connect", ()=>console.log('object'))
        mongoose.connection.on("error", ()=> { throw new Error(`Unable to connect the database`) });
        // if ( process.env.mongoDebug === "true") 
        //     mongoose.set('debug',  (collectionName, method, query, doc) => {
        //         debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
        //     });
    };

    function mountMiddleware(){
        app.use(require("passport").initialize());
        app.use(require("passport").session());
        app.use(require("helmet")());
        // if ( process.env.NODE_ENV == "development")
            // app.use(require('morgan')('dev'));
        app.use(require('body-parser').json());
        app.use(require('body-parser').urlencoded({ extended: false }));
        app.use(require('cookie-parser')());
        app.use(require('cors')());
    };

    function mountRoutes(){
        
        app.use("/api", require('./index.route'));
    
        // Catch the 404 error and pass it to the error handler
        app.use( (req, res, next ) => {
            const error = new errors.NotFound();
            return next( error);
        });

        // Error Handler, if development, also send the stacktract.
        app.use( ( error, req, res, next ) => {

            // if (  process.env.NODE_ENV == "development" ){
            //     console.log( error.stack )
            // }
            res.status(error.status).send({
                status  : 0,
                name    : error.name,
                message : error.message,
                stack   : process.env.NODE_ENV == "development"? error.stack : null 
            });
        });
        
    }

    mountDatabase();
    mountMiddleware();
    mountRoutes();

    return app;

}();

module.exports = App;