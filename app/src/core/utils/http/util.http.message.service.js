'use strict';

angular.module('libshareApp')
  .service('MsgHttpSrv', function ($http, ngNotify, $rootScope) {
    var msgHttp = {};

    msgHttp.showMsg = function (response, callback) {
      if (!response) {

        ngNotify.set('Falha de conexão com o servidor da LibShare, tente mais tarde.', { type: 'error', duration: 5000 });
      } else if (statusMsgOfServer(response)) {

        ngNotify.set(response.data.msg, { type: response.data.typeMsg, duration: 5000 });
      } else if (statusMsgContinueCallBack(response)) {

        ngNotify.set(response.data.msg, { type: response.data.typeMsg, duration: 5000 });
        callback && callback(response.data);
      } else if(statusMsgErroFonte(response)) {
        
        ngNotify.set('Erro de sistema, entre em contato com o suporte da LibShare, repassando o seguinte erro. Error::' + response.data.message, { type: 'error', duration: 10000 });
      } else if(!response.data){
        ngNotify.set('Houve algum problema na requisição ao servidor, tente novamente mais tarde.', { type: 'error', duration: 5000 });
      } else {
        
        callback && callback(response.data);
      }
    }

    function statusMsgOfServer(data) {

      if (data.hasOwnProperty('status') && (data.status == '409' || data.status == '404')) {
        return true;
      }

      return false;
    }

    function statusMsgContinueCallBack(data) {
      if (data.hasOwnProperty('status') && (data.status == '302')) {
        return true;
      }

      return false;
    }

    function statusMsgErroFonte(data) {
      if (data.hasOwnProperty('status') && (data.status == '400' || data.status == '500')) {
        return true;
      }

      return false;
    }

    return msgHttp;
  });
