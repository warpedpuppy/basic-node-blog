var express = require('express');
var models  = require('../models');
var bodyParser = require('body-parser');
var router = express.Router();
var env = require('../models').env;
var config    = require(__dirname + '/../config/config.json')[models.env];

var records_per_page = config.records_per_page;
var records_per_li = config.records_per_li;




/* GET users listing. */
router.get('/', function(req, res, next) {

    var page_counter = (req.query.c === undefined)?0:req.query.c;
    var start_number = (req.query.start_number === undefined)?0:req.query.start_number;
    var start_string = (req.query.start_number === undefined)?"id DESC":"id";
    var page_number = (req.query.p === undefined)?1:req.query.p;//li active

  models.essays.findAndCountAll({

    order:"id",
    offset:start_number,
    limit:records_per_li

  }).then(function(results) {

    var total_records = results.count;
    var essays = results.rows;

    start_number = (essays.length > 0)?essays[0].id:0;
    essays = essays.reverse();

     res.render("essays", {

        essays:essays,
        start_number:start_number,
        total_records:total_records,
        page_number:page_number,
        records_per_page:records_per_page,
        records_per_li:records_per_li,
        page_counter:page_counter
    });
  });
});


/* GET users listing. */
router.post('/comment', function(req, res, next) {

    var essay_id = req.body.essay_id;
    var name = req.body.name;
    var comment = req.body.comment;
    var essay_title = req.body.essay_title


    models.Comments.create({
        essay_id: essay_id,
        name: name,
        comment:comment,
        essay_title:essay_title,
        approved: false
    }).then(function(){

        res.redirect("/essays/"+essay_id);

    })
});



/* GET users listing. */
router.get('/:id', function(req, res, next) {


  var id = req.params.id;

  var show_one = true;
  models.essays.findAll({where:{id:id}}).then(function(essays) {

    var essay = essays[0];

    models.Comments.findAll({where:{essay_id:id}, order:'id DESC'}).then(function(comments) {

        res.render("essays", {
        comments:comments,
        essay:essay,
        show_one:show_one
        });
    });

  });
});


module.exports = router;
