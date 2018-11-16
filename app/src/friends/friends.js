'use strict';

angular.module('libshareApp')
  .controller('FriendsCtrl', function($scope, RestSrv, ArrayUtils) {
    var self = this;

    self.selected = '1';
    self.acceptUser = acceptUser;
    self.negateUser = negateUser;
    self.removeUser = removeUser;

    self.newFriends = [
      {name: 'Renato', lastName: 'Junior Ribeiro', pathFoto:'../img/users/ID_7/renato.jpg'}
      ,{name: 'Renan', lastName: 'Cantare', pathFoto:'../img/users/ID_6/renan.jpg'}
      ,{name: 'Marcela', lastName: 'Pimenta', pathFoto:'../img/users/ID_3/marcela.JPG'}
      ,{name: 'Luzia', lastName: 'Fonseca', pathFoto:'../img/users/ID_2/Luzia.JPG'}      
    ];

    self.friends = [
      {name: 'Gabriela', lastName: 'Ferreira Martins', pathFoto:'../img/users/ID_9/gabriela.jpg'}
      ,{name: 'Samuel', lastName: 'Abdias', pathFoto:'../img/users/ID_8/samuel.jpg'}
      ,{name: 'Marcio', lastName: 'Faria', pathFoto:'../img/users/ID_4/marcio.jpg'}
      ,{name: 'Regina', lastName: 'Barcelos de Souza', pathFoto:'../img/users/ID_5/regina.jpg'}      
    ];
    
    init()
    function init(){
      hasNewUser();
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
      // self.newFriends(function(item, index, arr){
      //   if (item.id == profile.id){

      //   }
      // });

      self.newFriends.splice(profile, 1);
      self.friends.push(profile);

      hasNewUser();
      // splice
    }

    function negateUser (profile) {
      self.newFriends.splice(profile, 1);

      hasNewUser();
    }

    function removeUser (profile) {
      self.friends.splice(profile, 1);
    }
  });
