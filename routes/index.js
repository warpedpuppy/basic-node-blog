var express = require('express');
var models  = require('../models');
var bodyParser = require('body-parser');
var router = express.Router();

/* GET home page. */



router.get('/', function(req, res) {



    models.essays.findAll({
       order:"id DESC",
        limit:1
    }).then(function(essays) {

        var essay = essays[0];
        res.render("index", {
            essay:essay
        });
    });




});






module.exports = router;
