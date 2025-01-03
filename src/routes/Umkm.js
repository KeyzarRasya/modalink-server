const express = require('express')
const Umkm = require('../model/Umkm')
const Offer = require("../model/Offer")
const bcrypt = require('bcrypt')


const router = express.Router();

router.post("/signup", async(req, res) => {
    const {umkmName, pemilikName, email, password, owningPercentages} = req.body;
    const findUmkm = await Umkm.findOne({email});
    if(findUmkm){
        return res.status(400).send({message:"this email is already used"})
    }
    const encPass = await bcrypt.hash(password, 12);
    const newUmkm = new Umkm({umkmName, pemilikName, email, owningPercentages, password:encPass});
    await newUmkm.save();
    res.status(200).send({message:"success creating account", account:newUmkm});
})

router.post("/login", async(req, res) => {
    const {email, password} = req.body;
    const findUmkm = await Umkm.findOne({email});
    if(!findUmkm){
        return res.status(400).send({message:"email not found"});
    }
    const isPassValid = await bcrypt.compare(password, findUmkm.password);
    return isPassValid ? res.status(200).send({message:"Success Login", account:findUmkm}) : res.status(400).send({message:"wrong password"})
})

router.post("/create/offer/:umkmId", async(req, res) => {
    const {umkmId} = req.params;
    const {percentages, price} = req.body;
    const findUmkm = await Umkm.findById(umkmId);
    if(!findUmkm){
        return res.status(400).send({message:"you are not registered as UMKM"});
    }
    const findOffer = await Offer.findOne({umkmId})
    if(findOffer){
        return res.status(400).send({message:"you already created an offer"});
    }
    const newOffer = new Offer({umkmId, percentage:percentages, price})
    findUmkm.offer = newOffer._id;
    await findUmkm.save();
    await newOffer.save();
    res.status(200).send({message:"success creating an offer", offer:newOffer, umkm:findUmkm})
})

router.get("/list/offer", async(req, res) => {
    const listOffer = await Offer.find().populate("umkmId");
    res.status(200).send({message:"success fetch all offered UMKM", offers:listOffer});
})

module.exports = router;