/**
 * Created by edwardwalther on 2/5/16.
 */

'use strict';
var app = angular.module('simple_node_blog', ['ui.tinymce','ngAnimate'])



    .filter('reverse', function () {
        return function (items) {
            if(items !== undefined)return items.slice().reverse();
        };
    })


    .controller('MainCtrl', ['$scope', 'essays','$sce', function ($scope, essays,$sce) {

        $scope.essays = essays.essays;
        $scope.show_one = false;
        $scope.trust = $sce.trustAsHtml;
        essays.get_essay_list('start', 1, 0);



        $scope.get_essay_list = function (index) {

            var start_number = $scope.essays.button_data_array[index].new_start_number;
            var p = $scope.essays.button_data_array[index].i;
            var c = $scope.essays.page_counter;

            essays.get_essay_list(start_number, p, c).success(function (data) {
                //$scope.button_data_array = essays.button_data_array;
                console.log("success = " + data);
                //$scope.comments = essays.essays.comments.reverse();

            })

        }
        $scope.switch_to_list = function () {
            $scope.show_one = false;

        }

        $scope.next = function (string) {


            var url;

            if (string == 'single_forward') {
                url = $scope.essays.single_forward_link_string;
                essays.getString(url).success(function (data) {
                    console.log("success = " + data);
                })
            }
            else if (string == 'double_forward') {
                url = $scope.essays.double_forward_string;
                essays.getString(url).success(function (data) {
                    console.log("success = " + data);
                })
            }
            else if (string == "single_back") {
                url = $scope.essays.single_back_button_string;
                essays.getString(url).success(function (data) {
                    console.log("success = " + data);
                })
            }
            else if (string == "double_back") {
                url = $scope.essays.double_back_button_string;
                essays.getString(url).success(function (data) {
                    console.log("success = " + data);
                })
            }


        }


        $scope.fetch_essay = function (index) {
            var id = $scope.essays.essays[index].id;

            essays.fetch_essay(id).success(function (data) {


                $scope.show_one = data.show_one;


            })
        }


    }])


    .controller('CommentCtrl', ['$scope', 'essays','$sce', function ($scope, essays,$sce) {


        $scope.essays = essays.essays;
        $scope.trust = $sce.trustAsHtml;
        $scope.tinymceOptions = {

            selector:'div.comment-div',
            menubar: false,
            statusbar: false,
            toolbar:false

        }
        $scope.add_comment = function () {

            console.log("comment body = " + $scope.comment_body)
            if (
                $scope.comment_body === undefined ||
                $scope.comment_name === undefined ||
                $scope.comment_body === "" ||
                $scope.comment_body === "") {
                $scope.comment_body = '';
                $scope.comment_name = '';
                $scope.warning = "please fill everything out";
                return;
            }
            else{
                essays.addComment({
                    comment_body: $scope.comment_body,
                    name: $scope.comment_name,
                    essay_id: $scope.essays.essay.id,
                    essay_title: $scope.essays.essay.essay_title
                }).success(function (data) {
                    $scope.warning = "";
                    $scope.comment_body = '';
                    $scope.comment_name = '';
                });

            }



        };


    }])


    .factory('essays', ['$http', function ($http) {
        var o = {
            essays: []
        };
        o.get_essay_list = function (start_number, p, c) {

            return $http.get('/essays/get_essay_list?start_number=' + start_number + "&p=" + p + "&c=" + c).success(function (data) {

                angular.copy(data, o.essays);
            });
        };
        o.getString = function (string) {

            return $http.get(string).success(function (data) {

                angular.copy(data, o.essays);
            });
        };

        o.fetch_essay = function (index) {

            return $http.get('/essays/fetch_essay/' + index).success(function (data) {
                console.log(data.essay.id);
                angular.copy(data, o.essays);
            });
        };

        o.addComment = function (comment) {
            return $http.post('/comment', comment);
        };
        return o;
    }])





