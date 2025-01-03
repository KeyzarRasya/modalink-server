const express = require("express");
const bcrypt = require("bcrypt")
const Investor = require("../model/Investor")
const Umkm = require("../model/Umkm")
const Offer = require("../model/Offer")
const midtrans = require('midtrans-client')
const {v4} = require('uuid')
const axios = require('axios')

const router = express.Router();

router.post("/signup", async(req, res) => {
    const {fullName, email, password} = req.body;
    const findInvestor = await Investor.findOne({email});
    if(findInvestor){
        return res.status(400).send({message:"this email is already used"})
    }
    const encPass = await bcrypt.hash(password, 12);
    const newInvestor = new Investor({fullName, email, password:encPass});
    await newInvestor.save();
    res.status(200).send({message:"success creating account", account:newInvestor});
})

router.post("/login", async(req, res) => {
    const {email, password} = req.body;
    const findInvestor = await Investor.findOne({email});
    if(!findInvestor){
        return res.status(400).send({message:"email not found"});
    }
    const isPassValid = await bcrypt.compare(password, findInvestor.password);
    return isPassValid ? res.status(200).send({message:"Success Login", account:findInvestor}) : res.status(400).send({message:"wrong password"})
})

router.post("/buy/:investorId/:offerId", async (req, res) => {
    const {investorId, offerId} = req.params;
    const findInvestor = await Investor.findById(investorId);
    const findOffer = await Offer.findById(offerId);
    if(!findInvestor && !findOffer){
        return res.status(400).send({message:"Data not found"})
    }
    try {
        const transactionData = {
            transaction_details: {
                order_id: v4(),
                gross_amount: 2000000
            },
            item_details:{
                id:offerId,
                price:findOffer.price
            },
            customer_details:{
                first_name:findInvestor.fullName,
                email:findInvestor.email,
                phone:findInvestor._id
            }
        };

        // Melakukan request POST ke Midtrans menggunakan axios.post
        const response = await axios.post(
            "https://app.sandbox.midtrans.com/snap/v1/transactions",
            transactionData,
            {
                headers: {
                    accept: "application/json",
                    'content-type': 'application/json',
                    authorization: `Basic ${process.env.AUTH_STRING}` // Ganti dengan key otorisasi yang benar
                }
            }
        );

        // Return the redirect URL in JSON format
        res.json({ redirect_url: response.data.redirect_url });
    } catch (error) {
        console.error("error");
        res.status(500).json({ error: 'Failed to create transaction' });
    }
});

router.get('/finish', async(req, res) => {
    const {order_id, status_code} = req.query
    const response = await axios({
        method:"GET",
        url:`https://api.sandbox.midtrans.com/v2/${order_id}/status`,
        headers:{
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization':`Basic ${process.env.AUTH_STRING}`
        }
    })
    const data = response.data;
    if(data.status_code !== "200" && data.transaction_status !== "settlement"){
        return {response:data, status:401};
    }
    console.log(data);
    res.send(data);
})

module.exports = router;