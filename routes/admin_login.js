var express = require('express');
var models  = require('../models');
var bodyParser = require('body-parser');
var router = express.Router();
var session = require("express-session");
var env = require('../models').env;
var config    = require(__dirname + '/../config/config.json')[models.env];



router.get('/', function(req, res) {

  res.render('admin_login');


});
router.post('/login', function(req, res) {
  var post = req.body;

  if (post.password === config.admin_password) {
    session.user_id = config.user_id;
    res.redirect('/admin');
  } else {
    res.render('admin_login');
  }





});


module.exports = router;
