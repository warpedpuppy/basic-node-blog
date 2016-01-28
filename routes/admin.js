var express = require('express');
var models  = require('../models');
var bodyParser = require('body-parser');
var router = express.Router();
var session = require("express-session");
var env = require('../models').env;
var config    = require(__dirname + '/../config/config.json')[models.env];


function checkAuth(req, res, next) {
  if (!session.user_id || session.user_id != config.user_id) {
    res.render('admin_login');
  } else {
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  }
}

router.get('/logout', function (req, res) {
  delete session.user_id;
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0').redirect('/admin');
});

router.get('/',checkAuth, function(req, res) {



  models.Media_table.findAll().then(function(media_object) {




    models.Comments.findAll({where:{approved:false}}).then(function(comments) {


        res.render('admin', {
          comments:comments,
          media_object: media_object
        });
    });
  });


});

router.get('/approve_comment/:d', function(req, res) {

  var approve_record = req.params.d;


  models.Comments.update(
      {
        approved: true
      },
      {
        where:{id:approve_record}
      }
  ).then(function(){


    res.redirect("/admin");

  })

});

router.get('/delete_comment/:d', function(req, res) {

  var delete_record = req.params.d;


  models.Comments.destroy({
    where:{
      id:delete_record
    }
  }).then(function(){


    res.redirect("/admin");

  })

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

  console.log(title);


  models.essays.create({
    title: title,
    essay: essay
  }).then(function(){

    //res.redirect("/admin");

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
