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
  res.redirect('/admin');
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



  var title = "Essay #";//req.body.title;
  var essay = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at quam sapien. Vestibulum condimentum laoreet tortor vel dictum. Donec sollicitudin enim at hendrerit ultricies. Vivamus justo lectus, pulvinar in dignissim egestas, faucibus at tellus. Nulla pellentesque mattis massa eget vulputate. Sed commodo bibendum sem a hendrerit. Maecenas varius, ex a vehicula pharetra, odio neque luctus nisl, ac ullamcorper nunc felis sit amet est. Curabitur ipsum dolor, finibus at accumsan et, commodo et odio. Quisque interdum, nisi in cursus pellentesque, augue mauris sodales sem, nec porttitor metus lorem id augue. Mauris volutpat justo quis metus sodales, vitae rhoncus justo commodo. Etiam pulvinar feugiat magna, eget facilisis mauris blandit id.\nSed malesuada lectus id est semper, vulputate sodales nunc mattis. Maecenas at sem volutpat, placerat lectus eu, hendrerit eros. Suspendisse semper nulla sit amet commodo volutpat. Integer accumsan est pellentesque placerat egestas. Nunc ligula elit, pretium sit amet eleifend nec, interdum non neque. Maecenas pellentesque convallis enim, sit amet scelerisque turpis aliquet id. Quisque non est laoreet, pretium eros at, semper eros. Fusce at euismod lacus, viverra tincidunt lacus. Aliquam nec nulla non nunc lacinia porttitor. Sed tempor quam lorem, ut tempor sapien vestibulum quis. Curabitur semper urna a ultricies faucibus.\nUt id eros at risus varius condimentum. Sed vel orci nec erat tempus bibendum. Integer et sapien odio. Integer vehicula neque eget ligula bibendum ornare. In placerat laoreet interdum. Mauris vitae arcu euismod, mattis sem ac, dapibus felis. Sed mollis leo ut elit aliquam lobortis. Pellentesque vitae dui et ipsum porttitor commodo non ullamcorper mi. Nulla vel urna id metus semper egestas. Integer accumsan est nec aliquet scelerisque. Suspendisse pulvinar augue odio, nec ultrices sapien posuere mollis. Aliquam pharetra, massa sed dapibus condimentum, ante libero eleifend nisl, eget efficitur felis ipsum quis leo. Nunc euismod lorem sed lorem ornare commodo. Curabitur finibus, justo in vestibulum facilisis, nisl lacus aliquam justo, eu tincidunt est ex at nunc. Fusce suscipit laoreet nulla quis condimentum. Vivamus nisi elit, congue et dui a, commodo sollicitudin ante.";//req.body.essay;
  var essay_counter = 1;

  for(var i = 0; i < 100; i++){
    models.essays.create({
      title: title+essay_counter.toString(),
      essay: essay
    });
    essay_counter +=1;

  }



  /*models.essays.create({
    title: title+essay_counter.toString(),
    essay: essay
  }).then(function(){

    res.redirect("/admin");

  })*/
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
