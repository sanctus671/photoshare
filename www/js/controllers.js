/* global angular, document, window */
'use strict';

angular.module('app.controllers', [])

.controller('NavCtrl', function($scope, $state) {
    $scope.hideFooter = false;
    $scope.hideNav = function(){
        $scope.hideFooter = true;
        $state.go("entry");
    }
})


.controller('HomeCtrl', function($scope, $ionicLoading, SITE_URL, $ionicPopup) {
    $scope.currentPhotoId =0;
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
                $scope.currentPhotoId = data.id;
                $scope.shareViaFacebook(data.id);
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
            });
            $scope.currentPhotoId = 0;
        }, options);	
    };  
    
    $scope.shareViaFacebook = function(imageId){
        var ref = window.open( SITE_URL + "?image=" + imageId, "_blank","clearcache=yes,clearsessioncache=yes");
        ref.addEventListener('loadstop', function(event) {        
            if (event.url.match("closeiab") && !event.url.match("facebook")) {
                ref.close();
                $ionicPopup.alert({
                title: 'Success',
                template: "The photo has been shared. Your photo ID is: " + $scope.currentPhotoId
                });                 
                $scope.currentPhotoId = 0;
            }
        });        
    }
    $scope.shareViaInstagram = function(){
        var t = "#kungfupanda";
        var u = "http://i.imgur.com/7NnWSgJ.jpg";
        window.plugins.socialsharing.shareViaInstagram('Message via Instagram', 'https://www.google.nl/images/srpr/logo4w.png', function() {console.log('share ok')}, function(errormsg){alert(errormsg)})
    }    
})


.controller('EntryCtrl', function($scope, $ionicLoading, $ionicPopup, SITE_URL, $ionicModal, $q, $http) {
    $scope.entry = {
        photoid:"0",
        name:"",
        email:"",
        phone:"",
        suburb:"",
        tos:false,
        vip:false
    };

    
    $ionicModal.fromTemplateUrl('templates/tos.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.tosModal = modal;
      });   
      
    $scope.openTos = function(){
        console.log("here");
        $scope.tosModal.show();
    }
    
    $scope.submitEntry = function(form){
        if (form.$valid){
            $ionicLoading.show({
                template: 'Submitting entry...'
            });             
            $scope.submitForm($scope.entry).then(function(data){
                $ionicLoading.hide();
                $scope.entry = {
                    photoid:"0",
                    name:"",
                    email:"",
                    phone:"",
                    suburb:"",
                    tos:false,
                    vip:false
                };   
                form.$setPristine();
                $ionicPopup.alert({
                title: 'Success',
                template: data.msg
                });                 
            },function(data){
                $ionicLoading.hide();
                $ionicPopup.alert({
                title: 'Error',
                template: data.msg
                });  
            })

        }

    }
    
    $scope.submitForm = function(entry){
        console.log(entry);
        var deferred = $q.defer();  
        $http.post(SITE_URL + "entry.php", entry)    
            .success(function(data) {
                if (data.result === "success"){
                    deferred.resolve(data);
                }
                else{deferred.reject(data);}
            })
            .error(function(data,status) {
                deferred.reject(data);
            });

        return deferred.promise;        
    }
    
    
})

;


