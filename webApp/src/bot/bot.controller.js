const axios = require('axios'),
      Bot = require('./bot.model'),
      errors = require('../utils/errors'),
      Intent = require('../intent/intent.model'),
      Config = require('../config/config.model');

/**
 * @api {post} /bot/train Train Bot
 * @apiName Train Bot
 * @apiGroup Bot
 * @apiDescription Train the bot with defined intents 
 * 
 * @apiSuccessExample { String } Success-Response:
 *    HTTP/1.1 200 OK
 *    
 */
const train = async( req, res, next ) => {

    let intents = null;

    try {
        intents = await Intent.list(0, 0).lean();
        if ( intents.length < 0 )
            return next( new errors.InvalidInput(`please create at least one intent`));
    } catch ( error ){
        return next( new errors.InternalServerError() );
    };

    try {
        let result = await axios.post( `${process.env.NLP_ENGINE}/train`, { intents });
        return res.send( 'OK' );
    } catch ( error ){
        return next( new errors.InternalServerError() );
    };
};

/**
 * @api {post} /bot Messaging bot
 * @apiName Messaging bot
 * @apiGroup Bot
 * @apiDescription speak with the bot and reply with the response from database
 * 
 * @apiParam { String } message the input from user
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "response": "Hello world!"
 *     }
 */
const messaging = async( req, res, next ) => {
  
    const { message: text } = req.body;
    let result = null;

    const { botOn, threshold, fallback } = await Config.get().lean();

    // disable api if bot it not on
    if ( !botOn )
        return next( new errors.Forbidden(`bot is closed;`))

    // transfer the request to nlp engine
    try {
        result = await axios.post( `${process.env.NLP_ENGINE}/predict`, { text });
        result = result.data;
    } catch ( error ){
        console.log(error);
        return next( new errors.InternalServerError() );
    }

    if ( result.error || result.data.length < 1 )
        return next( new errors.InvalidInput(`please train your model before messaging `));

    const prediction = result.data[0]; 

    // reply the fallback sentence if the score is lower than the threshold
    if ( prediction.score < threshold )
        return res.send({ response: fallback });

    try {
        let intent = await Intent.findOne({ intent: prediction.intent }).lean();
        return res.send({ response: intent.responses[0] });
    } catch ( error ){
        console.log(error);
        return next( new errors.InternalServerError() );
    }

};

module.exports = { train, messaging };