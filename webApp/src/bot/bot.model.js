const mongoose = require("mongoose");

const botSchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    numberOfIntent: { type: Number, required: true }
});

botSchema.statics.log = function( numberOfIntent ){
    let doc = new this({ numberOfIntent });
    return doc.save();
};

const Bot = mongoose.model("Bot", botSchema );

module.exports = Bot;