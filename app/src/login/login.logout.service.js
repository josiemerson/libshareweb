'use strict';

angular.module('libshareApp')
  .service('LoginLogoutSrv', function($http, $cookies, $rootScope, $location, $localStorage, ngNotify, SERVICE_PATH, Memory, MsgUtils) {
    var serviceFactory = {};
    var urlLogin  = SERVICE_PATH.PUBLIC_PATH + '/login';
    var urlLogout = SERVICE_PATH.PUBLIC_PATH + '/logout';

    serviceFactory.login = function(email, password, callback) {

      if($rootScope.useMemory){

        var user = Memory.find('usersMemory', undefined, undefined, {'email': email, 'senha': password});
        if (user) {
          $rootScope.authDetails = { name: user.name, authenticated: true, permissions: user.authorities , 'user' : user};
          $localStorage.authDetails = $rootScope.authDetails;
        } else {
          ngNotify.set('Email ou senha incorreto.', { type: 'error', duration: 5000 });
        }
      } else {
        
        var requestParams = {
          method: 'GET',
          url: urlLogin,
          headers: {
            'Content-Type': 'application/json'
            ,'authorization' : 'Basic ' + btoa(email + ':' + password)
          }
        };
  
        $http(requestParams).then(
          function success(response) {
            var data = response.data;
  
            if (data.principal) {
              $rootScope.authDetails = { name: data.name, authenticated: data.authenticated, permissions: data.authorities , user : data.principal};
              $localStorage.authDetails = $rootScope.authDetails;
              if (callback) {
                callback($rootScope.authDetails);
              } else {

                $location.path('/');
  
                MsgUtils.showSuccess('Bem vindo ' + data.name);
              }
            } else {
              $rootScope.authDetails = { name: '', authenticated: false, permissions: [] };
              ngNotify.set('Email ou senha incorreto.', { type: 'error', duration: 5000 });
            }
          },
          function failure(response) {
            $rootScope.authDetails = { name: '', authenticated: false, permissions: []};
            ngNotify.set('Email ou senha incorreto', { type: 'error', duration: 5000 });
          }
        );
      }
    };

    serviceFactory.logout = function() {
      var requestParams = {
        method: 'POST',
        url: urlLogout,
        headers: { 'Content-Type': 'application/json' }
      };

      $http(requestParams).finally(function success(response) {
        delete $localStorage.authDetails;
        $rootScope.authDetails = { name: '', authenticated: false, permissions: [] };
        $location.path("/");
      });
    };

    serviceFactory.verifyAuth = function() {
      var login = true;
      if ($localStorage.authDetails == undefined) {
        $location.path("/");
        login = false;
      }

      return login;
    }

    serviceFactory.verifyAuthSetDataStorage = function() {
      if ($localStorage.authDetails) {
        $rootScope.authDetails = $localStorage.authDetails;
        
        if ($localStorage.categoriesFind) {
          $rootScope.categoriesFind = $localStorage.categoriesFind;
        }

        if ($localStorage.userBooksFind){
          $rootScope.userBooksFind = $localStorage.userBooksFind;
        }
      } else {
        $location.path("/");
      }
    };

    return serviceFactory;
  });
