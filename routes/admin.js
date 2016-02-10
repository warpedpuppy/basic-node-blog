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

res.render('admin');

  /*models.Media_table.findAll().then(function(media_object) {
    models.Comments.findAll({where:{approved:false}}).then(function(comments) {
        models.essays.findAll({ attributes: ['id', 'essay_title'], order:"id DESC" }).then(function(essays) {

          res.render('admin', {
            comments:comments,
            media_object: media_object,
            essays:essays
          });

    });
  });

  });*/
});

router.get('/get_media',checkAuth, function(req, res) {


  models.Media_table.findAll().then(function(media_object) {

   res.json(media_object);

   });
});


router.get('/get_unapproved_comments/', function(req, res) {

  models.Comments.findAll({where:{approved:false}}).then(function(comments) {
    res.json(comments);
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


        res.json({success:true});

  })

});

router.get('/delete_essay/:d', function(req, res) {

  var essay_to_delete = req.params.d;

  models.essays.destroy({where:{id:essay_to_delete}}).then(function(essay){

    res.json({success:true});

  })


});

router.post('/edit_essay/:d', function(req, res) {

  var essay_to_edit = req.params.d;

  models.essays.findOne({where:{id:essay_to_edit}}).then(function(essay){

    res.json(essay);

  })


});

router.post('/submit_essay_edits/', function(req, res) {

  var id = req.body.id;
  var title = req.body.essay_title;
  var essay = req.body.essay;

  console.log(id+" "+title+" "+essay)

  models.essays.update(
        {
        essay_title:title,
        essay:essay
        },
        {
        where:{id:id}
        }
  ).then(function(data){
        console.log(data);
        res.json({success:true});

  })


});



router.get('/delete_comment/:d', function(req, res) {

  var delete_record = req.params.d;


  models.Comments.destroy({
    where:{
      id:delete_record
    }
  }).then(function(){

    res.json({success:true});
    //res.redirect("/admin");

  })

});



router.get('/delete_media/:d', function(req, res) {

  var delete_media = req.params.d;


  models.Media_table.destroy({
    where:{
      id:delete_media
    }
  }).then(function(){

    res.json({success:true});
    //res.redirect("/admin");

  })





});


router.post('/add_essay', function (req, res) {

  var title = req.body.essay_title;
  var essay = req.body.essay;

  console.log(title);


  models.essays.create({
    essay_title: title,
    essay: essay
  }).then(function(){

    res.json({success:true});

  })
});




router.post('/add_media', function (req, res) {

  var title = req.body.title;
  var author = req.body.author;
  var genre = req.body.genre;


  models.Media_table.create({
    title: title,
    author: author,
    genre:genre
  }).then(function(){
    res.json({success:true});
   // res.redirect("/admin");

  })
});
router.get('/get_essay_list', function(req, res) {



  models.essays.findAll({
    attributes:['id', 'essay_title', 'essay']

  }).then(function(data){
    res.json(data);


  })

});

module.exports = router;
