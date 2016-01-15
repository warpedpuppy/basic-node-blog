var express = require('express');
var models  = require('../models');
var bodyParser = require('body-parser');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {

  var start_number = (req.query.start_number === undefined)?0:req.query.start_number;
  var start_string = (req.query.start_number === undefined)?"id DESC":"id";
    var page_number = (req.query.p === undefined)?0:req.query.p;

  models.essays.findAndCountAll({

    order:start_string,
    offset:start_number,
    limit:10

  }).then(function(results) {

      var count = results.count;
      var essays = results.rows;

    start_number = essays[0].id;
   if(start_string == "id")essays = essays.reverse();
    var last_id;

    if(start_string == "id")
      last_id = start_number - 10;
    else
      last_id = start_number - 19;

    res.render("essays", {

        essays:essays,
        start_number:start_number,
        last_id:last_id,
        count:count,
        page_number:page_number
    });
  });
});





/* GET users listing. */
router.get('/:id', function(req, res, next) {

  var id = req.params.id;

  var show_one = true;
  models.essays.findAll({where:{id:id}}).then(function(essays) {

    var essay = essays[0];

    res.render("essays", {
      essay:essay,
      show_one:show_one
    });
  });
});


module.exports = router;
