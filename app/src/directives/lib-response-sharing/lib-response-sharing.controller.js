angular.module('libshareApp').controller('SharingResponseCtrl', function ($uibModalInstance, $scope, RestSrv, data, MsgUtils, StringUtils, URLS_SERVICES) {
    var self = this;

    self.optionStatusSharing = [
      {key: 'A', value: 'Aprovar'}
      ,{key: 'N', value: 'Negar'}
    ];

    self.showValueItemSharing = data.showValueItemSharing;
    self.valueItemSharing = data.valueItemSharing;

    self.ok = function () {
      if (self.showValueItemSharing && !StringUtils.isEmpty(self.valueItemSharing) && self.valueItemSharing <= 0){

        MsgUtils.showError("Valor deve ser maior que zero.");
      } else if (StringUtils.isEmpty(self.statusItemSharing)) {

        MsgUtils.showError("Solicitação deve ser respondida através do campo 'Status compartilhamento' para que a mesma seja salva!");
      } else {
        
        RestSrv.blockRequest("Salvando resposta da solicitação...");
        // var params = {
        //   codSharing: data.codSharing
        //   ,codItemSharing : data.codItemSharing
        //   , statusItemSharing: self.statusItemSharing
        //   ,observation: self.observation
        // };
  
        var sharingItem = {
          sharing: data.codSharing
          ,sharingItem: data.codItemSharing
          ,sharingType: undefined//Tipo de compartilhamento Venda ou compra
          ,devolutionDate: undefined//Data da devolução
          ,sharingItemValue: self.valueItemSharing
          ,observation: self.observation
          ,statusSharing: self.statusItemSharing
          ,book: undefined          
        } ; 

        RestSrv.add(URLS_SERVICES.SHARING_PORTAL_SAVE_STATUS_SHARING, sharingItem, function(response){
          
          MsgUtils.showSuccess("Resposta salva com sucesso.");
          $uibModalInstance.close(response);
        });
      }
    };
  
    self.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });