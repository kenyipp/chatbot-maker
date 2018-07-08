const Intent = require('./intent.model'),
      errors = require('../utils/errors.js');

/**
 * @api {get} /intent Get intents
 * @apiName Get Intents
 * @apiGroup Intent
 * @apiDescription get the created intent and respone according to the limit and offset
 * 
 * @apiParam {String} [limit=15] limit of the intents' response
 * @apiParam {Number} [offset=0] the nth intents' response
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *  {
        {
            "data": [
                {
                    "responses": [
                        "你好"
                    ],
                    "utterances": [
                        "你好",
                        "Hello"
                    ],
                    "_id": "5b40d9c0b9c1b6f5956c63a7",
                    "intent": "Hello",
                    "__v": 0
                },
                {
                    "responses": [
                        "再見"
                    ],
                    "utterances": [
                        "再見",
                        "Bye Bye"
                    ],
                    "_id": "5b40da0930cac6f5adc2f22f",
                    "intent": "Bye",
                    "__v": 0
                }
            ],
            "count": 2
        }
 *  }
 */
const getIntents = async ( req, res, next ) => {
    let { offset, limit } = req.query;
    // parse the variable to int if exist
    offset = offset? parseInt(offset): 0;
    limit  = limit? parseInt(limit): 15;

    try {
        let docs = Intent.list( offset, limit );
        let count = Intent.count();
        [ docs, count ] = await Promise.all( [docs, count ])
        return res.send({ data: docs, count: count });
    } catch( error ){
        return next( new errors.InvalidInput() );
    }
}

/**
 * @api {post} /intent Create intent
 * @apiName Create intent
 * @apiGroup Intent
 * @apiDescription create the intent with label, utterances and response
 * 
 * @apiParam {String} intent the name of the intent
 * @apiParam {String} response the bot response when reach this intent 
 * @apiParam {String[]} utterances training sample for the intent
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * 
 * {
        "data": {
            "responses": [
                null
            ],
            "utterances": [
                "Good morning",
                "早安"
            ],
            "_id": "5b41c24c4b47cffe4c2dc241",
            "intent": "Good_Morning",
            "__v": 0
        }
    }
 * 
 **/
const createIntent = async ( req, res, next ) => {
    const { intent, response, utterances } = req.body;

    try {
        let doc = await Intent.create( intent, response, utterances );
        return res.send({ data: doc });
    } catch ( error ){
        console.log(error)
        return next( new errors.InvalidInput() );
    };
};

/**
 * @api {get} /intent/:intentId Get Intent
 * @apiName Get Intent
 * @apiGroup Intent
 * @apiDescription get the detail of the intent
 * 
 * @apiParam {String} intentId the id of the intent
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * 
 * {
        "data": {
            "responses": [
                "你好"
            ],
            "utterances": [
                "你好",
                "Hello"
            ],
            "_id": "5b40d9c0b9c1b6f5956c63a7",
            "intent": "Hello",
            "__v": 0
        }
    }
 **/
const getIntentDetail = async ( req, res, next ) => {
    return res.send({ data: req.intent });
};

/**
 * @api {post} /intent/:intentId Update intent
 * @apiName Update intent
 * @apiGroup Intent
 * @apiDescription update the intent's name and response
 * 
 * @apiParam {String} intentId the id of the intent
 * @apiParam {String} intent the name of the intent
 * @apiParam {String} response the bot response when reach this intent 
 * @apiParam {String[]} utterances training sample for the intent
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * 
 * {
        "data": {
            "responses": [
                "你好"
            ],
            "utterances": [
                "你好",
                "Hello"
            ],
            "_id": "5b40d9c0b9c1b6f5956c63a7",
            "intent": "HELLO",
            "__v": 0
        }
    }
 * 
 **/
const updateIntent = async ( req, res, next ) => {
    const { intent, response, utterances } = req.body;
    let intentDoc = req.intent;

    intentDoc.intent     = intent? intent: intentDoc.intent;
    intentDoc.responses  = response? [ response ]: intentDoc.responses;
    intentDoc.utterances = utterances? utterances: intentDoc.utterances;

    try {
        intentDoc = await intentDoc.save();
        return res.send({ data: intentDoc });
    } catch ( error ){
        console.log(error)
        return next( new errors.InvalidInput()) ;
    }

};

/**
 * @api {delete} /intent/:intentId Delete intent
 * @apiName Delete intent
 * @apiGroup Intent
 * @apiDescription delete the intent, remainder retrain your model after delete the intent
 * 
 * @apiParam {String} intentId the id of the intent
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 * 
 * {
        "data": {
            "responses": [
                null
            ],
            "utterances": [
                "Good morning",
                "早安"
            ],
            "_id": "5b41c24c4b47cffe4c2dc241",
            "intent": "Good_Morning",
            "__v": 0
        }
    }
 * 
 **/
const removeIntent = async ( req, res, next ) => {
    let intent = req.intent;
    try {
        intent = await intent.remove();
        return res.send({ data: intent });
    } catch ( error ){
        return next( new errors.InternalServerError()) ;
    }

};

// const insertUtterance = async ( req, res, next ) => {
//     let intent = req.intent;
//     const { utterance } = req.body;
//     intent.utterances.push( utterance );
//     try {
//         intent = await intent.save();
//     } catch ( error ){
//         return next( new errors.InvalidInput()) ;
//     }
// };

// const bulkWriteUtterances = async ( req, res, next ) => {
//     let intent = req.intent;
//     const { utterances } = req.body;
//     intent.utterances = [].concat(intent.utterances, utterances);
//     try {
//         intent = await intent.save();
//     } catch ( error ){
//         return next( new errors.InvalidInput()) ;
//     }
// };

const load = async ( req, res, next, intentId ) => {
    try {
        let intent = await Intent.findById( intentId );
        if ( !intent )
            return next( new errors.InvalidInput() );
        req.intent = intent;
        return next();
    } catch ( error ) {
        return next( new errors.InvalidInput() );
    }    
}

module.exports = {
    load, getIntents,
    createIntent, getIntentDetail, updateIntent, 
    removeIntent
    // insertUtterance, bulkWriteUtterances
};