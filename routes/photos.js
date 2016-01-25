var express = require('express');
var models  = require('../models');
var bodyParser = require('body-parser');
var router = express.Router();




/* GET users listing. */
router.get('/', function(req, res, next) {


     res.render("photos");

});





module.exports = router;
