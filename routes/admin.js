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

});

router.get('/clear_dbs/',checkAuth, function(req, res) {

   // models.Comments.destroy({truncate:true});
   // models.essays.destroy({truncate:true});
    models.essays.drop();
    models.Comments.drop();


    models.reset_dbs();

});

router.post('/insert_records/',checkAuth, function(req, res) {

    add_fake_essays();

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



router.post('/add_location/', function(req, res) {

    var longitude = req.body.longitude;
    var latitude = req.body.latitude;
    var city = req.body.city;
    var state = req.body.state;
    var country = req.body.country;



    models.map_data.create({
        longitude: longitude,
        latitude:latitude,
        city:city,
        state:state,
        country: country
    }).then(function(){

        res.json({success:true});

    })


});






router.post('/approve_and_respond_to_comment/', function(req, res) {

  var approve_record = req.body.id;
  var comment_text = req.body.comment;
  var response = req.body.response;


  models.Comments.update(
      {
        comment:comment_text,
        response:response,
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

router.get('/delete_location/:d', function(req, res) {

    var delete_record = req.params.d;


    models.map_data.destroy({
        where:{
            id:delete_record
        }
    }).then(function(){

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


router.get('/delete_media_created/:d', function(req, res) {

    var delete_media = req.params.d;


    models.media_created.destroy({
        where:{
            id:delete_media
        }
    }).then(function(){

        res.json({success:true});

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


router.post('/get_media_created', function (req, res) {


    models.media_created.findAll().then(function(data){
        res.json(data);

    })
});

router.post('/add_media_created', function (req, res) {

    var title = req.body.title;
    var description = req.body.description;


    models.media_created.create({
        title: title,
        description: description
    }).then(function(){
        res.json({success:true});
        // res.redirect("/admin");

    })
});




router.post('/get_locations', function (req, res) {

    models.map_data.findAll().then(function(data){
        res.json(data);
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

function add_fake_essays(){

    var title = "Essay #";
    var essay = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at quam sapien. Vestibulum condimentum laoreet tortor vel dictum. Donec sollicitudin enim at hendrerit ultricies. Vivamus justo lectus, pulvinar in dignissim egestas, faucibus at tellus. Nulla pellentesque mattis massa eget vulputate. Sed commodo bibendum sem a hendrerit. Maecenas varius, ex a vehicula pharetra, odio neque luctus nisl, ac ullamcorper nunc felis sit amet est. Curabitur ipsum dolor, finibus at accumsan et, commodo et odio. Quisque interdum, nisi in cursus pellentesque, augue mauris sodales sem, nec porttitor metus lorem id augue. Mauris volutpat justo quis metus sodales, vitae rhoncus justo commodo. Etiam pulvinar feugiat magna, eget facilisis mauris blandit id.";
    var essay_counter = 1;

    for(var i = 0; i < 100; i++){
        models.essays.create({
            essay_title: title+essay_counter.toString(),
            essay: essay
        });

        models.Comments.create({
            essay_id: i,
            name:"name of commenter",
            comment: "comment text",
            essay_title:title+essay_counter.toString(),
            approved:false


        });

        essay_counter +=1;

    }

}


module.exports = router;
