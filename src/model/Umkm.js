const mongoose = require("mongoose")

const umkmSchema = new mongoose.Schema({
    umkmName:String,
    pemilikName:String,
    email:String,
    password:String,
    owningPercentages:{
        type:Number,
        require:true
    },
    moneyReport:{
        type:String,
        default:""
    },
    offer:{
        type:mongoose.Schema.ObjectId,
        ref:"Offer"
    }
})

const Model = mongoose.model("Umkm", umkmSchema);

module.exports = Model;