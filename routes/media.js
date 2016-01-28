var express = require('express');
var models  = require('../models');
var bodyParser = require('body-parser');
var router = express.Router();


router.get('/', function(req, res) {



    models.Media_table.findAll({order:'id DESC'}).then(function(media_object) {


        res.render('media', {
            media_object: media_object
        });


    });


});

router.get('/grab_json', function(req, res) {



    models.Media_table.findAll({order:'id DESC'}).then(function(media_object) {


        res.json(media_object);


    });


});




module.exports = router;
