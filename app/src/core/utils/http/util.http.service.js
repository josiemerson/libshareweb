'use strict';

angular.module('libshareApp')
  .service('HttpRequestSrv', function($http, ngNotify, $rootScope, MsgHttpSrv) {
    return function(url, method, data, callback, catchError) {
      var header = { 'Content-Type': 'application/json;charset=utf-8' };
      // if ($rootScope.dadosSignup) {
      //   header.authorization = 'Basic ' + btoa($rootScope.dadosSignup.email + ':' + $rootScope.dadosSignup.password);
      // }

      var requestParams = {
        method: method,
        url: url,
        headers: header,
        cors : {origin: 'http://localhost'},
        data: data
      };

      $http(requestParams).then(
        function successCallback(response) {
          callback && callback(response.data);
        },
        function errorCallback(response) {
          MsgHttpSrv.showMsg(response, callback);
        });
    };
  })
  .service('RestSrv', function(HttpRequestSrv) {
    var restFactory = {};

    // Find all data.
    restFactory.find = function(url, callback, catchError) {
      HttpRequestSrv(url, 'GET', {}, callback, catchError);
    };

    // Aadd a new data.
    restFactory.add = function(url, data, callback, catchError) {
      HttpRequestSrv(url, 'POST', data, callback, catchError);
    };

    // Edit a data.
    restFactory.edit = function(url, data, callback, catchError) {
      HttpRequestSrv(url, 'PUT', data, callback, catchError);
    };

    // Delete a data.
    restFactory.delete = function(url, data, callback, catchError) {
      HttpRequestSrv(url, 'DELETE', data, callback, catchError);
    };

    return restFactory;
  });
