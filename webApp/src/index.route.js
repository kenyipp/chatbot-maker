const express = require("express");
const router = express.Router();

// Check service health
router.get('/health-check', (req, res) => res.send('OK'));

router.use('/config', require('./config/config.route'));
router.use('/user', require('./user/user.route'));
router.use('/intent', require('./intent/intent.route'));
router.use('/bot', require('./bot/bot.route'));

module.exports = router;

