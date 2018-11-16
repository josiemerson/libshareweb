'use strict';

angular.module('libshareApp')
  .service('Transporter', function() {
    var transporterByScreen = {};
    var dataByScreen = {};

    transporterByScreen.getData = function(screen){
      return dataByScreen[screen]; 
    }

    transporterByScreen.setData = function (screen, data) {
      dataByScreen[screen] = data;
    }

    return transporterByScreen;
  });
