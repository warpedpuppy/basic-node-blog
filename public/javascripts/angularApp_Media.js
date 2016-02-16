/**
 * Created by edwardwalther on 2/5/16.
 */

'use strict';
var app = angular.module('simple_node_blog', [])

    .controller('MainCtrl', ['$scope', 'media',  function ($scope, media) {

        $scope.media = media.media;

        media.get_media_list();





    }])
    .controller('MediaCreatedCtrl', ['$scope',  'media_created', function ($scope,  media_created) {


        $scope.media_created = media_created.media_created;


         media_created.get_media_created_list();





    }])


    .factory('media', ['$http', function ($http) {
        var o = {
            media: []
        };

        o.get_media_list = function () {

            return $http.get('/media/get_media').success(function (data) {

                angular.copy(data, o.media);
            });

        };


        return o;
    }])
    .factory('media_created', ['$http', function ($http) {
        var o = {
            media_created: []
        };

        o.get_media_created_list = function () {

            return $http.get('/media/get_media_created').success(function (data) {

                console.log("media created = "+data)
                angular.copy(data, o.media_created);
            });

        };


        return o;
    }])





