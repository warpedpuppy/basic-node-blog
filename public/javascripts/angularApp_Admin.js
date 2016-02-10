/**
 * Created by edwardwalther on 2/5/16.
 */

'use strict';
var app = angular.module('ashlander', ['ui.router'])

    .config([
        '$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state('admin', {
                    url: '/admin',
                    templateUrl: '/enter_essay.html',
                    controller: 'MainCtrl'
                });

            $urlRouterProvider.otherwise('admin');
        }])





    .filter('reverse', function () {
        return function (items) {
            if(items !== undefined)return items.slice().reverse();
        };
    })


    .controller('MainCtrl', ['$scope', 'essays','comments', 'media', function ($scope, essays,comments, media) {


        $scope.show_add_essay = true;
        $scope.show_add_media = false;
        $scope.show_approve_comments = false;
        $scope.show_edit_media = false;
        $scope.show_delete_essays = false;
        $scope.media = media.media;

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


    }])

    .controller('ManageMediaCtrl', ['$scope', 'media', function ($scope, media) {
        $scope.media = media.media;

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



    .controller('DeleteEditEssaysCtrl', ['$scope','essays', '$location', '$anchorScroll', function ($scope,essays,$location, $anchorScroll) {
        $scope.essays = essays.essays;
        $scope.show_edit_form = false;
        $scope.edit_essay_index = undefined;

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

    .controller('ApproveCommentsCtrl', ['$scope', 'comments', function ($scope, comments) {

        $scope.comments = comments.comments;

        $scope.approveComment = function(id, index){


            comments.approve_comment(id).success(function(data){

                $scope.comments.splice(index,1)
            });
        }

        $scope.deleteComment = function(id, index){

            comments.delete_comment(id).success(function(data){

                $scope.comments.splice(index,1)
            });

        }
    }])

    .controller('AddMediaCtrl', ['$scope', 'media', function ($scope, media) {

        $scope.addMediaFormFunction = function () {
            if (
                $scope.media_title === undefined ||
                $scope.media_author === undefined ||
                $scope.media_genre === undefined ||
                $scope.media_title === "" ||
                $scope.media_author === "") {
                $scope.media_title = '';
                $scope.media_author = '';
                $scope.media_genre = $scope.media_genre[0];
                $scope.warning = "please fill everything out";
                return;
            }
            else{
                media.add_media({
                    title: $scope.media_title,
                    author: $scope.media_author,
                    genre: $scope.media_genre
                }).success(function (data) {
                    $scope.warning = "";
                    $scope.media_title = '';
                    $scope.media_author = '';
                    $scope.media_genre = $scope.media_genre[0];
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

        o.add_media = function (media) {
            //console.log("TESTING + "+media.title);
            return $http.post('/admin/add_media/',media).success(function (data) {

                console.log("success 2");
                //angular.copy(data, o.essays);
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
            console.log("TESTING + "+essay.essay_title);
            return $http.post('/admin/add_essay/',essay).success(function (data) {

                console.log("success 2");
                //angular.copy(data, o.essays);
            });
        };


        return o;
    }])





