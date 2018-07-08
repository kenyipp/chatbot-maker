const errors = require('./errors'),
      mongoose = require('mongoose'),
      debug = require('debug')('Utils:validator')

const type = {
    string  : 'string',
    number  : 'number',
    boolean : 'boolean'
};

const checkArray = type => array => {
    return {
        check : target => {
            if ( target && !Array.isArray(target))
                return new errors.InvalidInput("Wrong parameter type");
            if ( !target )
                return null;
            for ( item of target ){
                if ( isCorrectType( type ) )
                    return new errors.InvalidInput("Wrong parameter type");
            }
        },
        isRequired: {
            check : target => {
                if (  typeof(target) == "undefined"  )
                    return new errors.InvalidInput("Missing paramter(s)");
                for ( item of target ){
                    if ( isCorrectType( type ) )
                        return new errors.InvalidInput("Wrong parameter type");
                }
            }
        }
    }
};



const isCorrectType = type => target => {
    if ( target && typeof(target) != type)
        return new errors.InvalidInput("Wrong parameter type");
};

const isRequired = type => target => {
    if (  typeof(target) == "undefined"  )
        return new errors.InvalidInput("Missing paramter(s)");
    return isCorrectType(type)(target);
};

const getChecker = type => ({
    check : isCorrectType( type ),
    isRequired: { check : isRequired( type ) } 
});

const types = {
    array: {
        number   : checkArray(type.number),
        string   : checkArray(type.string),
        boolean  : checkArray(type.boolean),
        objectId : {
            check : target => {
                if ( target && !Array.isArray(target))
                    return new errors.InvalidInput("Wrong parameter type");
                if ( !target )
                    return null;
                for ( objectId of target ){
                    if ( ( !mongoose.Types.ObjectId.isValid(objectId) ) )
                        return new errors.InvalidInput("Wrong parameter type");
                }
            },
            isRequired: { 
                check: target =>{
                    if (  typeof(target) == "undefined"  )
                        return new errors.InvalidInput("Missing paramter(s)");
                    for ( objectId of target ){
                        if ( ( !mongoose.Types.ObjectId.isValid(objectId) ) )
                            return new errors.InvalidInput("Wrong parameter type");
                    }
                } 
            }
        }
    },
    number  : getChecker(type.number),
    string  : getChecker(type.string),
    boolean : getChecker(type.boolean),
    optional : {
        check: ()=>{},
        isRequired: { check: ()=>{} }
    },
    // thanks https://github.com/Automattic/mongoose/issues/1959
    objectId : {
        check : objectId => {
            if ( !mongoose.Types.ObjectId.isValid(objectId) )
                return new errors.InvalidInput("Wrong parameter type");
        },
        isRequired: { 
            check : objectId => {
            if (  typeof(objectId) == "undefined"  )
                return new errors.InvalidInput("Missing paramter(s)");
            }
        } 
    }
}

const executor = defination => {
    return function( req, res, next ){
        let keys = Object.keys( defination );
        for ( key of keys ) {
            let error = defination[key].check(req.body[key]);
            if ( error ) {
                debug(error.message);
                return next( error );
            }
        }
        return next();
    }
};

module.exports = executor;
module.exports.types = types;