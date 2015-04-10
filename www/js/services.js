angular.module('starter.services', [])

.factory('Users', function($http) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  baseurl = 'https://api.mongolab.com';

  return {
    all: function() {
      return users;
    },
    
    getall: function(callbackFunc) {
    $http({
        method: 'GET',
        url: baseurl+'/api/1/databases/demodb/collections/users?apiKey=GBzJ3MiQKXztqWL8fRNePO5Qq0fVu1bU'
     }).success(function(data){
        // With the data succesfully returned, call our callback
        callbackFunc(data);
    }).error(function(){
        alert("error");
    });
   },

  getUser: function(userId, callbackFunc) {
    
    var queryJson = '{"userName" : "'+userId+'"}';
    console.log("User Selection query :"+ queryJson);
    $http({
        method: 'GET',
        url: baseurl+'/api/1/databases/demodb/collections/users?apiKey=GBzJ3MiQKXztqWL8fRNePO5Qq0fVu1bU&q='+queryJson
     }).success(function(data){
        // With the data succesfully returned, call our callback
        callbackFunc(data);
    }).error(function(){
        alert("error");
    });
   }
  };
})
