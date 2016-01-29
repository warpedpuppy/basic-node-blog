var express = require('express');
var models  = require('../models');
var bodyParser = require('body-parser');
var router = express.Router();


router.get('/', function(req, res) {


    res.render("/edit_essay");



});





module.exports = router;
