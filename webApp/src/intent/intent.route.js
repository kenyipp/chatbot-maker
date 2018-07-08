const Ctrl = require('./intent.controller'),
      express = require('express'),
      jwt = require("express-jwt"),
      auth = jwt({ secret: process.env.SECRET_KEY });

const router = express.Router();

router.route('/')
    .get( auth, Ctrl.getIntents)
    .post( auth, Ctrl.createIntent);

router.route('/:intentId')
    .get( auth, Ctrl.getIntentDetail )
    .post( auth, Ctrl.updateIntent)
    .delete( auth, Ctrl.removeIntent);

// router.route('/utterance')
//     .post( auth, Ctrl.insertUtterance);

// router.route('/utterances')
//     .post( auth, Ctrl.bulkWriteUtterances);

router.param('intentId', Ctrl.load);

module.exports = router;