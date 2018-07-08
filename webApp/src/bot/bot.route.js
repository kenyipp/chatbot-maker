const Ctrl = require('./bot.controller'),
      express = require('express'),
      jwt = require("express-jwt"),
      auth = jwt({ secret: process.env.SECRET_KEY });
    
const router = express.Router();

router.route('/')
    .post(Ctrl.messaging);

router.route('/train')
    .post( auth, Ctrl.train );

module.exports = router;
