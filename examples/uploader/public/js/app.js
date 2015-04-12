'use strict';

var app = angular.module('amna-example-upload', ['ngUpload', 'ngAnimate']);

app.controller('uploadController', function ($scope, $http, $timeout) {

    $scope.pictures = [];

    var latestTime = 0;

    var loadUploads = function () {
        $http.get('/uploads')
        .success(function (response) {
            response.data.forEach(function (uploaded) {
                if (uploaded.createdAt > latestTime) {
                    $scope.pictures.push(uploaded);
                    latestTime = uploaded.createdAt;
                }
            });
        })
        .error(function (error) {
            console.error(error);
        });
    };

    loadUploads();

    $scope.complete = function (content) {
      $scope.response = content;
      if (content.status === 'ok') {
        $scope.pictures.push(content.data);
      }

      $scope.showMessage = true;
      $timeout(function () {
        $scope.showMessage = false;
      }, 3000);
    };

    $scope.deleteImage = function (picture) {
        picture.deleting = true;
        $http.delete('/uploads/' + picture._id)
        .success(function (response) {
            $scope.pictures.splice($scope.pictures.indexOf(picture), 1);
        })
        .error(function (err) {
            picture.deleting = false;
        });
    };

});

// http://stackoverflow.com/questions/16207202/required-attribute-not-working-with-file-input-in-angular-js
app.directive('validFile', function () {
  return {
    require: 'ngModel',
    link: function (scope, el, attrs, ngModel) {
      // change event is fired when file is selected
      el.bind('change', function () {
        scope.$apply(function () {
          ngModel.$setViewValue(el.val());
          ngModel.$render();
        });
      });
    }
  }
});
