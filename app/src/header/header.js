// 'user strict';

angular.module('libshareApp').
  controller('headerSrv', ['$scope','$rootScope', '$location', 'LoginLogoutSrv', function($scope, $rootScope, $location, LoginLogoutSrv) {
    var self = this;

    self.login = login;
    self.home = home;
    self.logout = logout;
    $scope.isPageLogin = false;

    $rootScope.isPageLogin = function(isPageLogin){
       $scope.isPageLogin = isPageLogin;
    };
    
    $scope.hasAnyPermission = function(authorities) {
      var hasPermission = false;
      

      $rootScope.authDetails.permissions.forEach(function(permission) {
        authorities.forEach(function(authority) {
          if (permission.authority === authority) {
            hasPermission = true;
          }
        });
      });

      return hasPermission;
    };

    function home(){
      $rootScope.isPageLogin(false);
      $location.path("#/");
    }

    function login () {
      $location.path("/login");
      $rootScope.isPageLogin(true);
    }
    
    function logout () {
      $rootScope.isPageLogin(false);
      LoginLogoutSrv.logout();
    };

  }]);
