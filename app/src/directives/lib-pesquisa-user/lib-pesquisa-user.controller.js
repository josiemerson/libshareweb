angular.module('libshareApp').controller('PesquisaUserCtrl', function ($uibModalInstance, $scope, RestSrv, data, MsgUtils, StringUtils, URLS_SERVICES) {
    var self = this;

    init()
    function init(){
      RestSrv.blockRequest("Buscando usuários com compartilhamentos");
      
      // self.gridOptions.api.setRowData(self.sharing);
      // buildSharingItem();
      //Apesar de estar como add é uma requisição de consulta
      RestSrv.find(URLS_SERVICES.SHARING_PORTAL_GET_USERS_SHARING + data.codUsuLogged ,function(response){

        self.listUsersResponse = response.usersSharing;
        RestSrv.unblockRequest();
      });
    }

    self.doubleclikedUser = function(user) {
      $uibModalInstance.close(user);
    };

    self.clikedUser = function(user) {
      self.userClickedNow = user;
    }

    self.ok = function () {
      $uibModalInstance.close(self.userClickedNow);
    };
  
    self.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });