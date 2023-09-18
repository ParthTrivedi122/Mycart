const express = require("express")
const fs = require("fs");
const { request } = require("http");
const router = express.Router();

router.get('/dashboard',(request,response)=>
{
    response.render('dashboard/dashboard.ejs');
})

module.exports= router