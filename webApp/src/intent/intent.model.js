const mongoose = require("mongoose"),
      bluebird = require("bluebird");

const intentsSchema = new mongoose.Schema({
    intent: { 
        type     : String, 
        required : true, 
        unique   : true,
        validate : {
            validator : function( value ){
                return /^[a-z0-9_]+$/i.test( value );
            },
            message: "Intent can consist only english character, number and undersocre(_). "
        }
    },
    // response can be various from ( location, gallery, card view ... etc )
    // for now, it support only text message 
    responses : [ mongoose.Schema.Types.Mixed ],
    // TODO: It should store into seperate table 
    utterances : [{ type:String }]
});

intentsSchema.statics = {

    create : function( intent, response, utterances ){
        let doc = new this({
            intent      : intent,
            // receive single response but store in array, 
            // for the further development purpose
            responses   : [ response ],
            utterances  : utterances
        });
        return doc.save();
    },

    get : function( intentId ){
        return this.findById(intentId);
    },

    list: function( offset=0, limit=15 ){
        return this.find().sort({createdAt: -1}).skip(offset * limit).limit(limit);
    }

};

const Intent = mongoose.model("Intent", intentsSchema);

module.exports = Intent;