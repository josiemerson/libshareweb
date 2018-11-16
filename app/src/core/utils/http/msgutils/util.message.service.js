'use strict';

angular.module('libshareApp')
  .service('MsgUtils', function(ngNotify) {
    var msgUtils = {};

    msgUtils.showError = function(msg, callback){
      buildMsg(msg, 'error', callback);
    }

    msgUtils.showAlert = function(msg, callback){
      buildMsg(msg, 'warn', callback);
    }

    //cor roxo claro
    msgUtils.showGrim = function(msg, callback){
      buildMsg(msg, 'grimace', callback);
    }
    //cor preto
    msgUtils.showDefault = function(msg, callback){
      buildMsg(msg, 'default', callback);
    }

    msgUtils.showSuccess = function(msg, callback){
      buildMsg(msg, 'success', callback);
    }

    msgUtils.showInfo = function(msg, callback){
      buildMsg(msg, 'info', callback);
    }

    function buildMsg(msg, type, callback){
      if (msg) {
        ngNotify.set(msg, type);
        callback && callback();
      } else {
        console.error('Msg não foi repassada para a function do libShare.');
      }
    }

    return msgUtils;
  });
