var express = require('express');
var models  = require('../models');
var bodyParser = require('body-parser');
var router = express.Router();


router.get('/', function(req, res) {


    res.render('media');



});
router.get('/get_media', function(req, res) {


    models.Media_table.findAll({order:'id DESC'}).then(function(media_object) {
        res.json(media_object);
    });


});

router.get('/get_media_created', function(req, res) {


    models.media_created.findAll({order:'id DESC'}).then(function(media_object) {
        res.json(media_object);
    });


});

router.get('/get_map_data', function(req, res) {
    models.map_data.findAll().then(function(map_data) {
        res.json(map_data);
    });
});

router.get('/grab_json', function(req, res) {



    models.Media_table.findAll({order:'id DESC'}).then(function(media_object) {


        res.json(media_object);


    });


});




module.exports = router;
