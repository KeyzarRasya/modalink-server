const mongoose = require('mongoose')

const investorSchema = new mongoose.Schema({
    fullName:String,
    email:String,
    password:String
})

const Model = mongoose.model("Investor", investorSchema);

module.exports = Model;