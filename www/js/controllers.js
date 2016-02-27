/* global angular, document, window */
'use strict';

angular.module('app.controllers', [])

.controller('HomeCtrl', function($scope, $ionicLoading, SITE_URL, $ionicPopup) {
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
        $ionicLoading.show({
            template: 'Uploading image...'
        }); 

        var options = new FileUploadOptions();
        options.fileKey="fileToUpload";
        var d = new Date();
        options.fileName="photo"
        options.mimeType="image/jpeg";
        options.params = {};
        var ft = new FileTransfer();
        ft.upload(imageURI, encodeURI(SITE_URL + "upload.php"), function(response){
            $ionicLoading.hide();
            var data = JSON.parse(response.response);
            if (data.result === 'success'){
                $scope.shareViaFacebook(encodeURI(SITE_URL + data.url));
            }
            else{               
                $ionicPopup.alert({
                title: 'Error',
                template: data.msg
                });                
            }
        },  
        function(data){           
            $ionicLoading.hide();        
            $ionicPopup.alert({
            title: 'Error',
            template: 'Sorry, there was an error uploading your file.'
            });}, options);	
    };  
    
    $scope.shareViaFacebook = function(imageUrl){
        window.open( SITE_URL, "_system");
    }
    $scope.shareViaInstagram = function(){
        var t = "#kungfupanda";
        var u = "http://i.imgur.com/7NnWSgJ.jpg";
        window.plugins.socialsharing.shareViaInstagram('Message via Instagram', 'https://www.google.nl/images/srpr/logo4w.png', function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
    }    
});


