const express = require("express");
const bcrypt = require("bcrypt")
const Investor = require("../model/Investor")
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

router.post("/buy", async (req, res) => {
    try {
        const transactionData = {
            transaction_details: {
                order_id: v4(),
                gross_amount: 2000000
            },
        };

        // Melakukan request POST ke Midtrans menggunakan axios.post
        const response = await axios.post(
            "https://app.sandbox.midtrans.com/snap/v1/transactions",
            transactionData,
            {
                headers: {
                    accept: "application/json",
                    'content-type': 'application/json',
                    authorization: 'Basic U0ItTWlkLXNlcnZlci0wWmsxRnBKTVdTQndaN1pMRFRUeGtndXg6' // Ganti dengan key otorisasi yang benar
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

module.exports = router;