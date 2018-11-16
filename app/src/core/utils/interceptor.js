'use strict';

angular.module('libshareApp')
  .service('httpRequestInterceptor', function ($q, $cookies) {
  return {
    request: function (config) {
      config.headers['X-XSRF-TOKEN'] = $cookies.get('XSRF-TOKEN');

      return config;
    },

    responseError: function(rejection) {
       if (rejection.status === 401) {
       }

       return $q.reject(rejection);
    }
  };
});
