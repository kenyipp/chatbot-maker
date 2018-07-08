const Ctrl = require('./config.controller'),
      express = require('express'),
      jwt = require("express-jwt"),
      auth = jwt({ secret: process.env.SECRET_KEY });

const router = express.Router();

router.route('/')
    .get( auth, Ctrl.getConfig )
    .post( auth, Ctrl.setConfig );

module.exports = router;

