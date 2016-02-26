/* global angular, document, window */
'use strict';

angular.module('app.controllers', [])

.controller('HomeCtrl', function($scope) {
    console.log("here");
    
    $scope.useGetFile = function(){
          navigator.camera.getPicture(
                  $scope.onPhotoSuccess,
                  function(message){/*alert('Failed: ' + message);*/},
                  {
                          quality: 25,
                          sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                          encodingType: Camera.EncodingType.JPEG,
                          correctOrientation: true
                  }
          )      
    };



    $scope.useGetPicture = function(){
          navigator.camera.getPicture(
                  $scope.onPhotoSuccess,
                  function(message){/*alert('Failed: ' + message);*/},
                  {
                          quality: 25,
                          sourceType: Camera.PictureSourceType.Camera,
                          encodingType: Camera.EncodingType.JPEG,
                          correctOrientation: true,
                          cameraDirection: Camera.Direction.FRONT
                  }
          )      
    };  
  
    $scope.onPhotoSuccess = function(imageURI){


          var options = new FileUploadOptions();
          options.fileKey="fileToUpload";
          options.fileName=$rootScope.user.username;
          options.mimeType="image/jpeg";
          options.params = {key:API_KEY,session:$rootScope.user.sessionid, controller:"edit", action:"uploaddp", userid:$rootScope.user.id};
          var ft = new FileTransfer();
          ft.upload(imageURI, encodeURI(API_URL), function(data){
              $ionicLoading.hide();
              var response = JSON.parse(data.response);
              if (response.success === true){   
                  $rootScope.user.dp = response.data;
                  $scope.profile.dp = response.data;         
              }
              else{
                  SecuredPopups.show('alert',{
                  title: 'Error',
                  template: "Error: " + JSON.stringify(response)
                  });                
              }
          },  
          function(data){  
              $ionicLoading.hide();        
              SecuredPopups.show('alert',{
              title: 'Error',
              template: 'Sorry, there was an error uploading your file.'
              });
          }, options);		


    };  
    
    $scope.shareViaFacebook = function(){
        var t = "#kungfupanda";
        var u = "http://i.imgur.com/7NnWSgJ.jpg";
        window.open( 'http://www.facebook.com/sharer.php', "_blank", "EnableViewPortScale=yes,location=yes,toolbar=yes");
    }
    $scope.shareViaInstagram = function(){
        var t = "#kungfupanda";
        var u = "http://i.imgur.com/7NnWSgJ.jpg";
        window.plugins.socialsharing.shareViaInstagram('Message via Instagram', 'https://www.google.nl/images/srpr/logo4w.png', function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
    }    
});


