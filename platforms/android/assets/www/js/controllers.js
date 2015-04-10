// idea : show to people count in cafetaria
// idea : Lunch Reminder

angular.module('starter.controllers', ['ngCordova','angularFileUpload','ionic.rating'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
 
  $scope.chats = Chats.all();
  Chats.getall(function(dataResponse) {
        $scope.users = dataResponse;
    });

  console.log("Users : "+JSON.stringify($scope.users));

  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FoodMenuCtrl', function($scope, $stateParams, Menu) {

    $scope.rate = 3;
  $scope.max = 5;

  Menu.getMenu(function(dataResponse) {
        $scope.menuItems = dataResponse;
    });

  console.log("Users : "+JSON.stringify($scope.menuItems));
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller("ExampleCtrl", function($rootScope, $scope, $http, $cordovaCamera,$cordovaCapture,$cordovaFile,$cordovaNetwork,$ionicModal, $ionicPopup,$ionicLoading,$location, Chats, $window) {

//$ionicModal, $ionicPopup,$ionicLoading,$rootScope, $stateParams,$location,$cordovaCapture,$cordovaFile,$cordovaNetwork

    ionic.Platform.ready(function() {
    if (!navigator.camera){
      return;
    }
        pictureSource=navigator.camera.PictureSourceType.CAMERA;
        destinationType=navigator.camera.DestinationType.FILE_URI;
    });


    $scope.takePicture = function() {

      try{
        document.addEventListener("deviceready", function() {


        var options = { 
            quality : 75, 
            destinationType : Camera.DestinationType.FILE_URL, 
            sourceType : Camera.PictureSourceType.CAMERA, 
            allowEdit : false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 300,
            targetHeight: 300,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.imgURI = "data:image/jpeg;base64," + imageData;
            $scope.imageLoc = imageData;
            alert($scope.imageLoc);
            //uploadFile(imageData);
        }, function(err) {
            // An error occured. Show a message to the user
        });

      }, false);
      } catch (e){
        alert('Error'+e);
      }
    }

    //$scope.uploadFile = function() {
    function uploadFile(){
      try { 
    //alert('Start uploading Photo');
    var fileURL = $scope.imageLoc;
    //alert("fileURL"+fileURL);
    var fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
    //alert("fileName"+fileName);

    var options = new FileUploadOptions();
    options.fileKey = "attachment";
    options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";

    var params = new Object();
    params.fullpath = '/home/action/t2sadmin/tmp/incoming/'+fileName;
    params.name = fileName;

    options.params = params;
    options.chunkedMode = true;
               
          }
          catch (err) {
              //  $ionicLoading.hide();
            alert('Error'+err);
          }

    //alert('Before File Transfer');

    var ft = new FileTransfer();
   // alert('After File Transfer');
   try{
    ft.upload(fileURL, encodeURI("http://t2sapp-185143.apse1.nitrousbox.com:3000/file-upload"),
      function(success) {
        alert('Photo Uploaded...');
        callback(null, 'success');
      }, 
      function(error) {
        
        var errStr = objToString(error);
        alert("Err - World is going to END!!!" + errStr);
        callback(error);

        function objToString (obj) {
        var str = '';
        for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
          }
        }
        return str;
        }

        alert("Err - World is going to END!!!" + JSON.stringify(error));


      }, options);
  }
  catch (err) {
    alert('Error'+err);
    callback(err);
  }
    };

    $scope.createUser = function () {
        var email = this.user.email;
        var message = this.user.message;
        var uName = this.user.name;
        if(!email || !message || !uName) {
          alert("Please enter valid data");
          return false;
        }
        alert('Please wait.. Registering');
        alert('Uploading Photo');
        uploadFile();

        var imageURL = $scope.imageLoc;
        var imageName = imageURL.substr(imageURL.lastIndexOf('/') + 1);

        var obj = '{\"userName\" : \"'+ uName +'\", \"email\" :\"'+ email +'\", \"message\" :\"'+ message +'\", \"photoUrl\" : \"'+ imageName +'\"}';

        var jsonObj = eval('(' + obj + ')');
        console.log("User Object :"+ JSON.stringify(jsonObj.email));

        var res = $http.post('https://api.mongolab.com/api/1/databases/demodb/collections/users?apiKey=GBzJ3MiQKXztqWL8fRNePO5Qq0fVu1bU', jsonObj);
        res.success(function(data, status, headers, config) {
        $scope.message = data;
        $window.location.href = ('#/tab/chats');
        });
        res.error(function(data, status, headers, config) {
        alert( "Failure message: " + JSON.stringify({data: data}));
        });
    };

          $scope.captureImage = function() {

            alert("success code  1");  

          function captureSuccess(imageData) {
            alert("Test"+ JSON.stringify(imageData));

            $scope.imgURI = imageData;
            $scope.imageLoc = imageData;
            alert($scope.imageLoc);
            uploadFile();
          
      }

      function captureError(error) {

          var msg = 'An error occurred during capture: ' + error.code;
          navigator.notification.alert(msg, null, 'Uh oh!');
              alert(msg);
      }  
      var options = { limit: 1 };

       alert("success code  3"); 

     
         $cordovaCapture.captureImage(options).then(captureSuccess,captureError);
         alert("success code  4");
};


});
