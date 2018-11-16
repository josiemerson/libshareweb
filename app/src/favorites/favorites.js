'use strict';

angular.module('libshareApp')
  .controller('FavoritesCtrl', function($scope, LoginLogoutSrv) {
    var self = this;
    self.login = login;

    function login (email, password) {
      LoginLogoutSrv.login(email, password);
    };
  });
