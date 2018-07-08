const mongoose = require("mongoose");

const configSchema = new mongoose.Schema({
    "fallback"  : String,
    "threshold" : Number,
    "botOn"     : Boolean
}, { timestamps: true });

configSchema.statics = {
    get: function(){
        return this.findOne({});
    },
    set: function( fallback, threshold, botOn ){
        let config = this.findOne({});
        config.fallback  = fallback? fallback: config.fallback;
        config.threshold = threshold? threshold: config.threshold;
        config.botOn     = botOn? botOn: config.botOn;
        return config.save();
    }
};

var Config = mongoose.model("Config", configSchema);

module.exports = Config;

// Initalize the config if not exist
Config.findOne({})
    .then( async res => {
        if ( !res ){
            await new Config({
                "fallback"  : "唔好意思, 我唔係太明你講乜 wo",
                "threshold" : 0.7,
                "botOn"     : true
            }).save();
        } else 
            console.log(res);
    });