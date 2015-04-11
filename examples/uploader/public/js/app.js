var app = angular.module('amna-example-upload', ['ngUpload', 'ngAnimate']);

app.controller('uploadController', function($scope, $http, $timeout) {

    $scope.pictures = [];

    var latestTime = 0;

    var loadUploads = function() {
        $http.get('/uploads')
        .success(function(response) {
            response.data.forEach(function(uploaded) {
                if (uploaded.createdAt > latestTime) {
                    //console.log('message: ' + message.createdAt);
                    $scope.pictures.push(uploaded);
                    latestTime = uploaded.createdAt;
                } else {
                    //console.log('This one is old');
                }
            });
        })
        .error(function(error) {
            console.log('error');
        });
    };

    loadUploads();

    $scope.complete = function(content) {
      $scope.notice = content;
      //console.log(content); // process content
      //$scope.pictures.push(content);
      loadUploads();

      $scope.showMessage = true;
      $timeout(function() {
        $scope.showMessage = false;
      }, 3000);
    }

});

//http://stackoverflow.com/questions/16207202/required-attribute-not-working-with-file-input-in-angular-js
app.directive('validFile',function(){
  return {
    require:'ngModel',
    link:function(scope,el,attrs,ngModel){
      //change event is fired when file is selected
      el.bind('change',function(){
        scope.$apply(function(){
          ngModel.$setViewValue(el.val());
          ngModel.$render();
        });
      });
    }
  }
});
