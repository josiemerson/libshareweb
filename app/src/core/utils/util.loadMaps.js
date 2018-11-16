'use strict';

angular.module('libshareApp')
  .service('LoadMaps', function() {
    var loadMaps = {};
    var callbackLoading;

    loadMaps.setCallbackLoad = function (callback){
      callbackLoading = callback;
    }

    loadMaps.getCallbackLoad  = function() {
     return callbackLoading;
    }

    return loadMaps;
  });
