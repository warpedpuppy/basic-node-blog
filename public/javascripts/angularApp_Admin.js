/**
 * Created by edwardwalther on 2/5/16.
 */

'use strict';
var app = angular.module('simple_node_blog', ['ui.tinymce'])






    .filter('reverse', function () {
        return function (items) {
            if(items !== undefined)return items.slice().reverse();
        };
    })


    .controller('MainCtrl', ['$scope', 'essays','comments', 'media', '$http','$sce',function ($scope, essays,comments, media,$http,$sce) {


        $scope.show_add_essay = true;
        $scope.show_add_media = false;
        $scope.show_approve_comments = false;
        $scope.show_edit_media = false;
        $scope.show_delete_essays = false;
        $scope.show_add_location = false;
        $scope.media = media.media;

        $scope.trust = $sce.trustAsHtml;

        $scope.emptyAndResetDBs = function(){
            return $http.get('/admin/clear_dbs/').success(function (data) {

            });

        }


        $scope.insert_records = function(){
            return $http.post('/admin/insert_records/').success(function (data) {

            });

        }

        $scope.setMaster = function(section) {
            $scope.selected = section;
        }

        $scope.isSelected = function(section) {
            return $scope.selected === section;
        }

        $scope.showEnterEssay = function(section){
            $scope.show_add_essay = true;
            $scope.show_add_media = false;
            $scope.show_approve_comments = false;
            $scope.show_edit_media = false;
            $scope.show_delete_essays = false;

        }
        $scope.showEnterMedia = function(){
            $scope.show_add_essay = false;
            $scope.show_add_media = true;
            $scope.show_approve_comments = false;
            $scope.show_edit_media = false;
            $scope.show_delete_essays = false;
        }
        $scope.showApproveComments = function(){
            $scope.show_add_essay = false;
            $scope.show_add_media = false;
            $scope.show_approve_comments = true;
            $scope.show_edit_media = false;
            $scope.show_delete_essays = false;

            comments.get_unapproved_comments();
        }
        $scope.showManageMedia = function(){
            $scope.show_add_essay = false;
            $scope.show_add_media = false;
            $scope.show_approve_comments = false;
            $scope.show_edit_media = true;
            $scope.show_delete_essays = false;
            media.get_media();

        }
        $scope.showDeleteEssays = function(){
            $scope.show_add_essay = false;
            $scope.show_add_media = false;
            $scope.show_approve_comments = false;
            $scope.show_edit_media = false;
            $scope.show_delete_essays = true;
            essays.get_essay_list();
        }
        $scope.showAddLocation = function(){
            $scope.show_add_essay = false;
            $scope.show_add_media = false;
            $scope.show_approve_comments = false;
            $scope.show_edit_media = false;
            $scope.show_delete_essays = false;
            $scope.show_add_location = true;
        }


    }])

    .controller('ManageMediaCtrl', ['$scope', 'media', '$http',function ($scope, media,$http) {
        $scope.media = media.media;
        $scope.show_delete_media_consumed = true
        $scope.deleteMedia = function(id){
            if(id === 1){
                $scope.show_delete_media_consumed = true
            }
            else{
                $scope.show_delete_media_consumed = false
            }
        }

        $scope.media_created = [];
        $http.post("/admin/get_media_created").success(function (data) {
            console.log("media created = "+data)
            angular.copy(data, $scope.media_created);
        });

        $scope.confirmDeleteMediaCreated = function(id, index){
            $http.get("/admin/delete_media_created/"+id).success(function (data) {
                //console.log("media created = "+data)
                //angular.copy(data, $scope.media_created);
                $scope.media_created.splice(index, 1);
            });
        }

        $scope.confirmDeletion = function(id, index){


                media.delete_media(id).success(function(data){
                    $scope.media.splice(index,1)

                });

        }

        $scope.toggleVisibility = function(model) {
            $scope.selected = ($scope.selected === undefined)?model:undefined;
        };
        $scope.isVisible = function(model) {
            return $scope.selected === model;
        };

    }])
    .controller('AddLocationCtrl', ['$scope', '$http', function ($scope, $http) {

        $scope.map_warning = 'warning';
        $scope.map_data = {};
        $scope.locations = [];

        $http.post("/admin/get_locations").success(function (data) {
            console.log("map data = "+data)
            angular.copy(data, $scope.locations);
        });

        $scope.deleteLocation = function(id, index){
            $http.get("/admin/delete_location/"+id).success(function (data) {
                $scope.locations.splice(index, 1)
            });
        }

        $scope.toggleVisibility = function(model) {
            $scope.selected = ($scope.selected === undefined)?model:undefined;
        };
        $scope.isVisible = function(model) {
            return $scope.selected === model;
        };

       // $scope.map_data.latitude = "42.192172";
       // $scope.map_data.longitude = "-122.700426";

        $scope.add_location_show = true;
        $scope.showLocation = function(id){
            if(id === 1){
                $scope.add_location_show = true;
            }
            else{
                $scope.add_location_show = false;
            }
        }
        $scope.submitAddLocation = function(){


                if (
                    $scope.map_data.longitude === ""||
                    $scope.map_data.latitude == "" ||
                    $scope.map_data.city == "" ||
                    $scope.map_data.state == "" ||
                    $scope.map_data.country == "") {

                    $scope.map_data.longitude = "";
                    $scope.map_data.latitude = "";
                    $scope.map_data.city = "";
                    $scope.map_data.state = "";
                    $scope.map_data.country = "";

                    $scope.map_warning = "please fill everything out";
                    return;
                }
                else{

                    return $http.post('/admin/add_location/',$scope.map_data).success(function (data) {

                        $scope.map_data.longitude = "";
                        $scope.map_data.latitude = "";
                        $scope.map_data.city = "";
                        $scope.map_data.state = "";
                        $scope.map_data.country = "";
                        //$scope.map_data.latitude = "42.29048";
                       // $scope.map_data.longitude = "-71.16706";
                        $scope.map_warning = "entered";
                    });

                }
            }




    }])



    .controller('DeleteEditEssaysCtrl', ['$scope','essays', '$location', '$anchorScroll', '$sce',function ($scope,essays,$location, $anchorScroll,$sce) {
        $scope.essays = essays.essays;
        $scope.show_edit_form = false;

        $scope.edit_essay_index = undefined;
        $scope.trust = $sce.trustAsHtml;

        $scope.submitEssayEdits = function(){
            if (
                $scope.essays.edit_essay.essay_title === "" ||
                $scope.essays.edit_essay.essay === "" ||
                $scope.essays.edit_essay.id === ""
            )
            {
                $scope.essays.edit_essay.essay_title = $scope.essays[$scope.edit_essay_index].essay_title;
                $scope.essays.edit_essay.essay = $scope.essays[$scope.edit_essay_index].essay;
                $scope.warning2 = "please fill everything out";
                return;
            }
            else{

                /*alert("here "+$scope.essays.edit_essay.essay_title);
                alert("here "+$scope.essays.edit_essay.essay);
                alert("here "+$scope.essays.edit_essay.id);*/


                essays.submit_edit_essay({
                    essay_title: $scope.essays.edit_essay.essay_title,
                    essay: $scope.essays.edit_essay.essay,
                    id: $scope.essays.edit_essay.id
                }).success(function (data) {

                    $scope.essays[$scope.edit_essay_index] = {
                        essay_title:$scope.essays.edit_essay.essay_title,
                        id: $scope.essays.edit_essay.id
                    };
                    $scope.edit_essay_index = undefined;



                    $scope.show_edit_form = false;
                    $scope.warning2 = "";
                    $scope.essays.edit_essay.essay_title = '';
                    $scope.essays.edit_essay.essay = '';
                    $scope.essays.edit_essay.id = "";

                    $location.hash('top');
                    $anchorScroll();

                });

            }

        }

        $scope.editEssay = function(id, index){

            essays.edit_essay(id).success(function(data){
                $scope.edit_essay_index = index;
                $scope.show_edit_form = true;
            });
        }

        $scope.deleteRecord = function(id, index){

                essays.delete_essay(id).success(function(data){
                $scope.essays.splice(index, 1);
            })

        }

        $scope.toggleVisibility = function(model) {
            $scope.selected = ($scope.selected === undefined)?model:undefined;
        };
        $scope.isVisible = function(model) {
            return $scope.selected === model;
        };

    }])

    .controller('AddEssayCtrl', ['$scope', 'essays', function ($scope, essays) {

        $scope.addEssayFormFunction = function () {

            alert("click"+$scope.essay_text)


            if (
                $scope.essay_title_text === undefined ||
                $scope.essay_text === undefined ||
                $scope.essay_title_text === "" ||
                $scope.essay_text === "") {
                $scope.essay_title_text = '';
                $scope.essay_text = '';
                $scope.warning = "please fill everything out";
                return;
            }
            else{
                essays.add_essay({
                    essay_title: $scope.essay_title_text,
                    essay: $scope.essay_text
                }).success(function (data) {
                    $scope.warning = "";
                    $scope.essay_title_text = '';
                    $scope.essay_text = '';
                });

            }



        }

    }])

    .controller('ApproveCommentsCtrl', ['$scope', 'comments', '$sce',function ($scope, comments,$sce) {

        $scope.comments = comments.comments;
        $scope.comment_respond_form_show = false;
        $scope.trust = $sce.trustAsHtml;
        $scope.approveComment = function(id, index){


            comments.approve_comment(id).success(function(data){

                $scope.comments.splice(index,1)
            });
        }

        $scope.approveAndRespond = function(comment){
            $scope.comment_respond_form_show = true;
            $scope.store_comment = comment.comment;
            $scope.comment_for_response = comment.comment;
            $scope.comment_id_for_response = comment.id;
            $scope.commenter_name_for_response = comment.name;


        }



        $scope.deleteComment = function(id, index){

            comments.delete_comment(id).success(function(data){

                $scope.comments.splice(index,1)
            });

        }

        $scope.submitCommentResponse = function(){

            if($scope.comment_for_response === ""){
                $scope.comment_for_response = $scope.store_comment;
                return;
            }
            else{

                comments.add_response_and_approve({
                    id: $scope.comment_id_for_response,
                    comment: $scope.comment_for_response,
                    response: $scope.comment_response
                }).success(function(){
                    $scope.comment_respond_form_show = false;
                            console.log("success response")
                });

            }


        }




        $scope.toggleVisibility = function(model) {
            $scope.selected = ($scope.selected === undefined)?model:undefined;
        };
        $scope.isVisible = function(model) {
            return $scope.selected === model;
        };



    }])



    .controller('AddMediaCtrl', ['$scope', 'media', function ($scope, media) {

        $scope.media_consumed_show = true;
        $scope.show_media = function(int){
            if(int === 1)
                $scope.media_consumed_show = true;
            else{
                $scope.media_consumed_show = false;
            }

        }
        $scope.addMediaFormFunction = function () {


            if (
                $scope.media_title === undefined ||
                $scope.media_author === undefined ||
                $scope.media_genre === undefined ||
                $scope.media_title === "" ||
                $scope.media_author === "") {
                $scope.media_title = '';
                $scope.media_author = '';
                $scope.media_genre = undefined;
                $scope.add_media_warning = "please fill everything out";
                return;
            }
            else{
                media.add_media({
                    title: $scope.media_title,
                    author: $scope.media_author,
                    genre: $scope.media_genre
                }).success(function (data) {
                    $scope.add_media_warning = "";
                    $scope.media_title = '';
                    $scope.media_author = '';
                    $scope.media_genre = undefined;
                });

            }
        }


        $scope.addMediaCreatedFormFunction = function () {
            if (
                $scope.media_created_title === "" ||
                $scope.media_created_description === "") {
                $scope.media_created_warning = "please fill everything out";
                return;
            }
            else{
                media.add_media_created({
                    title: $scope.media_created_title,
                    description: $scope.media_created_description
                }).success(function (data) {
                    $scope.media_created_warning = "";
                    $scope.media_created_title = '';
                    $scope.media_created_description = '';
                });

            }
        }

    }])

    .factory('media', ['$http', function ($http) {
        var o = {
            media: []
        };
        o.get_media = function () {

            return $http.get("/admin/get_media").success(function (data) {
                var reverse_it = data.reverse();
                angular.copy(reverse_it, o.media);
            });
        };
        o.delete_media = function (id) {

            return $http.get("/admin/delete_media/"+id);
        };
        o.approve_comment = function (id) {

            return $http.get("/admin/approve_comment/"+id).success(function (data) {

                console.log("approve comment success")
            });
        };
        o.add_media_created = function (media) {
            //console.log("TESTING + "+media.title);
            return $http.post('/admin/add_media_created/',media).success(function (data) {

                console.log("success media created");
                //angular.copy(data, o.essays);
            });
        };
        o.add_media = function (media) {
            //console.log("TESTING + "+media.title);
            return $http.post('/admin/add_media/',media).success(function (data) {

                console.log("success 2");
                //angular.copy(data, o.essays);
            });
        };


        return o;
    }])

    .factory('map_data', ['$http', function ($http) {
        var o = {
            map_data: []
        };
        o.get_unapproved_comments = function () {

            return $http.get("/admin/get_unapproved_comments").success(function (data) {
                var reverse_it = data.reverse();
                angular.copy(reverse_it, o.comments);
            });
        };

        return o;
    }])

    .factory('comments', ['$http', function ($http) {
        var o = {
            comments: []
        };
        o.get_unapproved_comments = function () {

            return $http.get("/admin/get_unapproved_comments").success(function (data) {
                var reverse_it = data.reverse();
                angular.copy(reverse_it, o.comments);
            });
        };
        o.delete_comment = function (id) {

            return $http.get("/admin/delete_comment/"+id).success(function (data) {

                console.log("delete success = ")
            });
        };
        o.approve_comment = function (id) {

            return $http.get("/admin/approve_comment/"+id).success(function (data) {

                console.log("approve comment success")
            });
        };
        o.add_response_and_approve = function(data){

            return $http.post("/admin/approve_and_respond_to_comment/", data).success(function (data) {

                console.log("approve comment/response success")
            });
        }



        return o;
    }])




    .factory('essays', ['$http', function ($http) {
        var o = {
            essays: []
        };
        o.get_essay_list = function (start_number, p, c) {

            return $http.get('/admin/get_essay_list').success(function (data) {
                var reverse_it = data.reverse();
                angular.copy(reverse_it, o.essays);
            });
        };
        o.getString = function (string) {

            return $http.get(string).success(function (data) {

                angular.copy(data, o.essays);
            });
        };
        o.delete_essay = function(id){

            return $http.get('/admin/delete_essay/'+id);

        }
        o.edit_essay = function(id){

            return $http.post('/admin/edit_essay/'+id).success(function (data) {
                o.essays.edit_essay = {};
                angular.copy(data, o.essays.edit_essay);
            });

        }
        o.submit_edit_essay = function(data){
            return $http.post('/admin/submit_essay_edits/', data).success(function (data) {
                console.log("success");
            });
        }




        o.add_essay = function (essay) {

            return $http.post('/admin/add_essay/',essay).success(function (data) {

                console.log("success 2");
                //angular.copy(data, o.essays);
            });
        };


        return o;
    }])





