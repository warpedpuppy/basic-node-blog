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

    res.render('essays')


});




router.get('/get_essay_list', function(req, res) {

    var page_counter = (req.query.c === undefined)?0:parseInt(req.query.c);
    var start_number = (req.query.start_number === undefined)?0:parseInt(req.query.start_number);
    var start_string =(req.query.start_number === 'start')?"id DESC":"id";
    var page_number = (req.query.p === undefined)?1:parseInt(req.query.p);

    models.essays.findAndCountAll({
        attributes:['id', 'essay_title', "createdAt", "updatedAt"],
        order:start_string,
        offset:start_number,
        limit:records_per_li

    }).then(function(results) {

        var total_records = results.count;
        var essays = results.rows;
        if(req.query.start_number === 'start')essays = essays.reverse();

        start_number = (essays.length > 0)?essays[0].id:0;
        essays = essays.reverse();


        var max_value = page_counter+records_per_page;
        var new_start_number, new_page_number, new_page_counter;
        function between(x, min, max) {return x >= min && x <= max;};

        //double back button class
        var double_back_class = (page_number < records_per_page)?'disabled':'';


        //double back button string
        new_start_number = start_number+(records_per_li-1);
        new_page_number = page_number - records_per_page;
        new_page_counter = page_counter -records_per_page ;
        var double_back_button_string = "/essays/get_essay_list/?start_number="+new_start_number+"&p="+new_page_number+"&c="+new_page_counter;
        if(page_number < records_per_page)double_back_button_string = "";



        //single back button class
        var single_back_class = (page_number == 1)?'disabled':'';


        //single back button string
        new_start_number = start_number+(records_per_li-1);
        new_page_number = page_number-records_per_li;
        var prev_page_check = page_number;
        var beg_of_row = between(prev_page_check, page_counter, (page_counter + records_per_li));
        new_page_counter = (beg_of_row)?(page_counter-records_per_page):page_counter;
        var single_back_button_string = "/essays/get_essay_list/?start_number="+new_start_number+"&p="+new_page_number+"&c="+new_page_counter;
        if(page_number == 1)single_back_button_string = "";

        //button data
        var final_number;
        var button_data_array = [];
        for(var i = page_counter; i < max_value; i++){
            if(i > total_records)break;

            var button_data_object = {};

            button_data_object.final_number = ((i+records_per_li) > total_records)?total_records:(i+records_per_li-1);
            if(button_data_object.final_number > max_value)button_data_object.final_number = max_value;

            button_data_object.i = i;

            button_data_object.class = (between(page_number, i, (button_data_object.final_number-1)))?'active':'';


            final_number = button_data_object.final_number;
            if((i-1) % records_per_li == 0){
                button_data_object.new_start_number = total_records - (records_per_li+i)+1;
                button_data_array.push(button_data_object);
            }

        }

        //single forward class
        var shut_off_number = page_number+records_per_li;
        var single_forward_class = (shut_off_number > total_records)?'disabled':'';


        //single forward link
        if(start_number == total_records)start_number -= (records_per_li-1);
        new_start_number = start_number-(records_per_li+1);
        new_page_number = page_number+records_per_li;
        var next_page_check = records_per_li+page_number;
        var end_of_row = between(next_page_check, page_counter, final_number);
        new_page_counter = (end_of_row)?page_counter:(page_counter+records_per_page);
        var single_forward_link_string = "/essays/get_essay_list/?start_number="+new_start_number+"&p="+new_page_number+"&c="+new_page_counter;
        if(shut_off_number > total_records)single_forward_link_string = "";




        //double forward class
        var shut_off_number = page_number+records_per_page;
        var double_forward_class = (shut_off_number > total_records)?'disabled':'';

        //double forward string
        new_start_number = start_number - (records_per_page)-1;
        new_page_number = page_number+records_per_page;
        new_page_counter = page_counter +records_per_page;
        var double_forward_string = "/essays/get_essay_list/?start_number="+new_start_number+"&p="+new_page_number+"&c="+new_page_counter;
        if(new_page_counter > total_records)double_forward_string = "#";


        res.json({
            double_back_class:double_back_class,
            double_back_button_string:double_back_button_string,
            single_back_class:single_back_class,
            single_back_button_string:single_back_button_string,
            button_data_array:button_data_array,
            single_forward_class:single_forward_class,
            single_forward_link_string:single_forward_link_string,
            double_forward_class:double_forward_class,
            double_forward_string:double_forward_string,
            essays:essays,
            essay:essays[0],
            start_number:start_number,
            total_records:total_records,
            page_number:page_number,
            records_per_page:records_per_page,
            records_per_li:records_per_li,
            page_counter:page_counter
        });
    });

});



router.get('/fetch_essay/:id', function(req, res) {
    var id = req.params.id;

    models.essays.findAll({where:{"id":id},limit:1}).then(function(essays){

        var essay = essays[0];

        models.Comments.findAll({where:{"essay_id":essay.id,"approved": true}}).then(function(comments){
            //console.log(comments);
            res.json({
                show_one:true,
                essay:essay,
                comments:comments
            })
        })




    });

/*
 //I STOPPED THIS BECAUSE IT WAS ONLY RESULTING IN THE MOST RECENT ESSAY THAT HAD AN APPROVED COMMENT -- WHILE I WANT THE MOST RECENT ESSAY AND ANY APPROVED COMMENTS IT HAS
    models.essays.hasMany(models.Comments, {foreignKey:'essay_id'})
    models.Comments.belongsTo(models.essays, {foreignKey:'essay_id'})
    models.essays.findAll({where:{id:id},order:"id DESC", limit:1,  include: [{model: models.Comments, where:{approved:true}}]}).then(function(essays){

        res.json({
            show_one:true,
            essay:essays[0]
        })
    });*/

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



module.exports = router;
