const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
    umkmId:{
        type:mongoose.Schema.ObjectId,
        ref:"Umkm"
    },
    percentage:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        default:0
    },
    investor:{
        type:mongoose.Schema.ObjectId,
        ref:"Investor",
        default:null
    },
    isUmkmAgree:{
        type:Boolean,
        default:false
    },
    isInvestorAgree:{
        type:Boolean,
        default:false
    }
})

const Model = mongoose.model("Offer", offerSchema);

module.exports = Model;