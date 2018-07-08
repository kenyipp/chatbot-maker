const Config = require('./config.model'),
      errors = require('../utils/errors');

/**
 * @api {get} /config Get the bot config
 * @apiName Get Config
 * @apiGroup Config
 * @apiDescription get the bot's config including the fallback, threshold and botOn status
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *  {
        "data": {
            "_id": "5b40e6d04f9ce5f84de4ac94",
            "fallback": "唔好意思, 我唔係太明你講乜 wo",
            "threshold": 0.7,
            "botOn": true,
            "createdAt": "2018-07-07T16:14:08.790Z",
            "updatedAt": "2018-07-07T16:14:08.790Z",
            "__v": 0
        }
 *  }
 */
const getConfig = async ( req, res, next ) => {
    let config = await Config.get();
    return res.send( { data: config } );
};

/**
 * @api {post} /config Set the bot config
 * @apiName Set Config
 * @apiGroup Config
 * @apiDescription set the bot's config including the fallback, threshold and botOn status
 * 
 * @apiParam {String} fallback The message reply to the user when fallback occur
 * @apiParam {Number} threshold If the prediction score is lower than the threshold, then it would goes into fallback
 * @apiParam {Boolean} botOn Variable that control the onOff of the bot 
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *  {
        "data": {
            "_id": "5b40e6d04f9ce5f84de4ac94",
            "fallback": "唔好意思, 我唔係太明你講乜 wo",
            "threshold": 0.7,
            "botOn": true,
            "createdAt": "2018-07-07T16:14:08.790Z",
            "updatedAt": "2018-07-07T16:14:08.790Z",
            "__v": 0
        }
 *  }
 */
const setConfig = async ( req, res, next ) => {

    // parse the threshold into number 
    req.body.threshold = parseFloat(req.body.threshold);
    // parse the botOn into boolean
    req.body.botOn = req.body.botOn === undefined? null : req.body.botOn === "true";

    const { fallback, threshold, botOn } = req.body;

    try {
        let config = await Config.set( fallback, threshold, botOn );
        res.send({ data: config });
    } catch ( error ){
        console.log(error);
        return next( new errors.InternalServerError());
    };
    
};

module.exports = { getConfig, setConfig };