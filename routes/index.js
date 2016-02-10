var express = require('express');
var models  = require('../models');
var bodyParser = require('body-parser');
var router = express.Router();



router.get('/', function(req, res) {

/*models.Comments.drop();
models.Comments.destroy({truncate:true});
models.essays.drop();
models.essays.destroy({truncate:true});*/
   // add_fake_essays();
    res.render("index");

});

router.get('/get_essay', function(req, res) {

    models.essays.findAll({order:[["id","DESC"]],limit:1}).then(function(essays){

        var essay = essays[0];

        models.Comments.findAll({where:{"essay_id":essay.id,"approved": true}}).then(function(comments){
            //console.log(comments);
            res.json({
                essay:essay,
                comments:comments
            })
        })




    });

   /*
   //I STOPPED THIS BECAUSE IT WAS ONLY RESULTING IN THE MOST RECENT ESSAY THAT HAD AN APPROVED COMMENT -- WHILE I WANT THE MOST RECENT ESSAY AND ANY APPROVED COMMENTS IT HAS
   models.essays.hasMany(models.Comments, {foreignKey:'essay_id'})
    models.Comments.belongsTo(models.essays, {foreignKey:'essay_id'})
    models.essays.findAll({

        order:[["id","DESC"]],

        limit:1,

        include: [{
            model: models.Comments,
            where:{approved:true}}]


        }).then(function(essays){

        res.json(essays)
    });*/

/*
models.sequelize.query("SELECT a.*, b.* FROM essays a JOIN Comments b ON b.essay_id=a.id WHERE b.approved=1 ORDER BY a.id DESC LIMIT 1").then(function(essays){
    console.log(essays);
    res.json(essays)
});;
*/


});



router.post('/comment', function(req, res, next) {

    var essay_id = req.body.essay_id;
    var name = req.body.name;
    var comment = req.body.comment_body;
    var essay_title = req.body.essay_title

    console.log(essay_id);


    models.Comments.create({
        essay_id: essay_id,
        name: name,
        comment:comment,
        essay_title:essay_title,
        approved: false
    }).then(function(data){
        //console.log(data.updatedAt)
        //req.data = data;
        //return next();
        //res.redirect("/");
        res.json(data)

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
