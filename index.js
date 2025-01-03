require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose')
const {envConfig} = require("./src/helper/config")
const investorRoutes = require('./src/routes/investor')
const umkmRoutes = require('./src/routes/Umkm');
const cors = require('cors')

const {DATABASE, URI, PORT} = envConfig(process.env);

mongoose.connect(DATABASE)
.then(res => console.log("Connected to database"))
.catch(err => console.log(err))

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.use("/investor", investorRoutes);
app.use("/umkm", umkmRoutes);

app.listen(PORT, () => {
    console.log("Server now running");
})