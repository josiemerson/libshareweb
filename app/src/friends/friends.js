'use strict';

angular.module('libshareApp')
  .controller('FriendsCtrl', function($scope, $rootScope, RestSrv, ArrayUtils, URLS_SERVICES, ImageSrv) {
    var self = this;

    self.selected = '1';
    self.acceptUser = acceptUser;
    self.negateUser = negateUser;
    self.removeUser = removeUser;

    self.area = "area";
    self.newFriends = [
      // {name: 'Renato', lastName: 'Junior Ribeiro', pathFoto:'../img/users/ID_7/renato.jpg'}
      // ,{name: 'Renan', lastName: 'Cantare', pathFoto:'../img/users/ID_6/renan.jpg'}
      // ,{name: 'Marcela', lastName: 'Pimenta', pathFoto:'../img/users/ID_3/marcela.JPG'}
      // ,{name: 'Luzia', lastName: 'Fonseca', pathFoto:'../img/users/ID_2/Luzia.JPG'}      
    ];

    self.friends = [
      // {name: 'Gabriela', lastName: 'Ferreira Martins', pathFoto:'../img/users/ID_9/gabriela.jpg'}
      // ,{name: 'Samuel', lastName: 'Abdias', pathFoto:'../img/users/ID_8/samuel.jpg'}
      // ,{name: 'Marcio', lastName: 'Faria', pathFoto:'../img/users/ID_4/marcio.jpg'}
      // ,{name: 'Regina', lastName: 'Barcelos de Souza', pathFoto:'../img/users/ID_5/regina.jpg'}      
    ];
    
    init()
    function init(){
      self.userDetails = $rootScope.authDetails.user;

      RestSrv.blockRequest('Carregando amigos');
      findFriendsByStatus('A', function(response){
        var listDataFriends = response;

        ArrayUtils.forEach(listDataFriends, function(item, index, arr) {
          var dataFriend = item.dataFriends;
          var statusFriend =  dataFriend.statusFriend;
          var userFriends = item.userFriends;
          
          var isFriend = statusFriend == "A" ? true : false;
          var profile = userFriends.profile;
          var friendFake = {name: profile.name
            ,lastName : profile.lastName
            , pathFoto : ImageSrv.buildUrlImage(profile.codUsu, profile.pathFoto)
            , friend: dataFriend
          };

          if (isFriend) {

            self.friends.push(friendFake);
          } else {

            self.newFriends.push(friendFake);
          }
        });

        if (listDataFriends.length > 3) {
          self.area = '';
          self.heighArea = listDataFriends
        }
        hasNewUser();

        RestSrv.unblockRequest();
      })
    }

    function findFriendsByStatus(status, callback){
      var url = URLS_SERVICES.FRIENDS_LIST_BY_STATUS + self.userDetails.id + "/" + status
      RestSrv.find(url, function(response){
        callback(response);
      });
    }

    self.isSelected = function (id){
      return self.selected == id;
    }

    self.select = function(setTab){
      self.selected = setTab;

      if(setTab == 1) {
        //buscar Friends
      } else if (setTab == 2){
        self.classeNewFriend = '';
        //buscar NewFriends
      }
    }

    function hasNewUser(){
      if (self.newFriends.length > 0) {
        self.classeNewFriend = 'classeNewFriend';
      }
    }

    function acceptUser(profile) {
      profile.friend.statusFriend = "A";
      RestSrv.edit(URLS_SERVICES.FRIENDS, profile.friend, function(response){
        
        self.newFriends.splice(profile, 1);
        self.friends.push(profile);
        hasNewUser();
      });
    }

    function negateUser (profile) {
      RestSrv.delete(URLS_SERVICES.FRIENDS, profile.friend, function(response){

        self.newFriends.splice(profile, 1);
  
        hasNewUser();
      });
    }

    function removeUser (profile) {
      RestSrv.delete(URLS_SERVICES.FRIENDS, profile.friend, function(response){

        self.friends.splice(profile, 1);
      });
    }
  });
