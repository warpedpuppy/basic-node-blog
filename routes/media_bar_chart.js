var express = require('express');
var models  = require('../models');
var bodyParser = require('body-parser');
var router = express.Router();

/* GET home page. */



router.get('/', function(req, res) {

  res.render('media_bar_chart');



});




module.exports = router;
