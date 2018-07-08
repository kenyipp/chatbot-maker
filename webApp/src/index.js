const app = require('./app');

const port = process.env.PORT || 3100;

let server = app.listen( port , function (error) {
    if (error)
        return console.log("Some Error Cause", error);
    console.log( `Server has listen at PORT ${port}` );
});

module.exports = server;