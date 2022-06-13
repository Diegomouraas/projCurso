const express = require('express')
const { route } = require("express/lib/application");
const router = express.Router()
const mongoose = require('mongoose')
require("../models/Usuario")
const Usuario = mongoose.model("usuarios")

router.get("/registro", (req, res) => {
    console.log("strict")
    res.render("usuarios/registro")
})


module.exports = router