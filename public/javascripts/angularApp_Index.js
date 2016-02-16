/**
 * Created by edwardwalther on 2/5/16.
 */

'use strict';
var app = angular.module('simple_node_blog', [])


    .controller('MainCtrl', ['$scope','essays',function($scope, essays){
        $scope.essays = essays.essays;

        essays.getAll();


    }])

    .controller('CommentCtrl', ['$scope','essays', function($scope, essays){
        $scope.essays = essays.essays;



        $scope.add_comment = function(){

            $scope.essay_id = $scope.essays.essay.id;
            $scope.essay_title = $scope.essays.essay.essay_title;
            $scope.warning = "";


            if(
                $scope.comment_body === undefined ||
                $scope.comment_name === undefined ||
                $scope.comment_body === "" ||
                $scope.comment_body === "") {
                $scope.comment_body = '';
                $scope.comment_name = '';
                $scope.warning = "please fill everything out";
                return;
            }

            essays.addComment({
                comment_body: $scope.comment_body,
                name: $scope.comment_name,
                essay_id: $scope.essay_id,
                essay_title: $scope.essay_title
            }).success(function(data) {
                $scope.warning ="";
                //$scope.essay.Comments.push({name:$scope.comment_name, comment:$scope.comment_body, updatedAt:data.updatedAt});
                $scope.comment_body = '';
                $scope.comment_name = '';
            });


        };


    }])

    .filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        };
    })
    .factory('essays',['$http',function($http){
    var o = {
        essays: []
    };

    o.getAll = function() {

        return $http.get('/get_essay').success(function(data){
            angular.copy(data, o.essays);
        });
    };
    o.addComment = function(comment) {
        return $http.post('/comment', comment);
    };
    return o;
}])





