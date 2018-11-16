'use strict';

angular.module('libshareApp')
  .controller('LoginCtrl', ['$scope', 'LoginLogoutSrv', '$location', function($scope, LoginLogoutSrv, $location) {
    var self = this;
    self.login = login;
    self.cadastrar = cadastrar;

    function login (email, password) {
      LoginLogoutSrv.login(email, password);
    };

    function cadastrar () {
      $location.path('/signup'); 
    }
  }]);
