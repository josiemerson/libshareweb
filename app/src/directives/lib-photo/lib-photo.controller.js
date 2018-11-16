angular.module('libshareApp').controller('ModalInstanceCtrl', function ($uibModalInstance, $scope) {
    var self = this;
    
    $scope.onLoad = function (e, reader, file, fileList, fileObjects, fileObj) {
      // self.fileObject = {e: e, reader: reader, file: file, fileList: fileList, fileObjects: fileObjects, fileObj:fileObj};
      self.fileObject = fileObj;
    }

    self.ok = function () {
      $uibModalInstance.close(self.fileObject);
    };
  
    self.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });