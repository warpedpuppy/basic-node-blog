var express = require('express');
var models  = require('../models');
var bodyParser = require('body-parser');
var router = express.Router();

/* GET home page. */



router.get('/', function(req, res) {



  models.Media_table.findAll().then(function(media_object) {

    res.render('admin', {
      media_object: media_object
    });

  });


});




router.get('/delete_record/:d', function(req, res) {

  var delete_record = req.params.d;


  models.Media_table.destroy({
    where:{
      id:delete_record
    }
  }).then(function(){


    res.redirect("/admin");

  })





});

router.post('/add_essay', function (req, res) {



  var title = req.body.title;
  var essay = req.body.essay;


  models.essays.create({
    title: title,
    essay: essay
  }).then(function(){

    res.redirect("/admin");

  })
});


router.post('/add_media', function (req, res) {

  var title = req.body.title;
  var author = req.body.author;
  var genre = req.body.genre_select;


  models.Media_table.create({
    title: title,
    author: author,
    genre:genre
  }).then(function(){

    res.redirect("/admin");

  })
});




module.exports = router;
