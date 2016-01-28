var express = require('express');
var models  = require('../models');
var bodyParser = require('body-parser');
var router = express.Router();



router.get('/', function(req, res) {

    //models.essays.drop();
    //models.essays.destroy({truncate:true});

    models.essays.findAll({
       order:"id DESC",
        limit:1
    }).then(function(essays) {

        if(essays.length >0){
            var essay = essays[0];

            console.log(essay.title)
            models.Comments.findAll({where:{essay_id:essay.id}}).then(function(comments) {
                res.render("index", {
                    essay:essay,
                    comments:comments
                });
            });
        }
        else{
                res.render("index");
        }




});


});


function add_fake_essays(){

    var title = "Essay #";
    var essay = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at quam sapien. Vestibulum condimentum laoreet tortor vel dictum. Donec sollicitudin enim at hendrerit ultricies. Vivamus justo lectus, pulvinar in dignissim egestas, faucibus at tellus. Nulla pellentesque mattis massa eget vulputate. Sed commodo bibendum sem a hendrerit. Maecenas varius, ex a vehicula pharetra, odio neque luctus nisl, ac ullamcorper nunc felis sit amet est. Curabitur ipsum dolor, finibus at accumsan et, commodo et odio. Quisque interdum, nisi in cursus pellentesque, augue mauris sodales sem, nec porttitor metus lorem id augue. Mauris volutpat justo quis metus sodales, vitae rhoncus justo commodo. Etiam pulvinar feugiat magna, eget facilisis mauris blandit id.\n\n\nSed malesuada lectus id est semper, vulputate sodales nunc mattis. Maecenas at sem volutpat, placerat lectus eu, hendrerit eros. Suspendisse semper nulla sit amet commodo volutpat. Integer accumsan est pellentesque placerat egestas. Nunc ligula elit, pretium sit amet eleifend nec, interdum non neque. Maecenas pellentesque convallis enim, sit amet scelerisque turpis aliquet id. Quisque non est laoreet, pretium eros at, semper eros. Fusce at euismod lacus, viverra tincidunt lacus. Aliquam nec nulla non nunc lacinia porttitor. Sed tempor quam lorem, ut tempor sapien vestibulum quis. Curabitur semper urna a ultricies faucibus.\n\n\nUt id eros at risus varius condimentum. Sed vel orci nec erat tempus bibendum. Integer et sapien odio. Integer vehicula neque eget ligula bibendum ornare. In placerat laoreet interdum. Mauris vitae arcu euismod, mattis sem ac, dapibus felis. Sed mollis leo ut elit aliquam lobortis. Pellentesque vitae dui et ipsum porttitor commodo non ullamcorper mi. Nulla vel urna id metus semper egestas. Integer accumsan est nec aliquet scelerisque. Suspendisse pulvinar augue odio, nec ultrices sapien posuere mollis. Aliquam pharetra, massa sed dapibus condimentum, ante libero eleifend nisl, eget efficitur felis ipsum quis leo. Nunc euismod lorem sed lorem ornare commodo. Curabitur finibus, justo in vestibulum facilisis, nisl lacus aliquam justo, eu tincidunt est ex at nunc. Fusce suscipit laoreet nulla quis condimentum. Vivamus nisi elit, congue et dui a, commodo sollicitudin ante.";
    var essay_counter = 1;

    for(var i = 0; i < 100; i++){
        models.essays.create({
            title: title+essay_counter.toString(),
            essay: essay
        });
        essay_counter +=1;

    }

}



module.exports = router;
