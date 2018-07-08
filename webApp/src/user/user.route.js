const express = require('express');
const userController = require('./user.controller');
const router = express.Router();
const params = require('./user.params');
const validate = require('../utils').validation;

router.route('/setup')
    // used to setup default admin account
    .get( userController.setup );

router.route('/login')
    // login route
    .post( validate(params.login), userController.login );

module.exports = router;