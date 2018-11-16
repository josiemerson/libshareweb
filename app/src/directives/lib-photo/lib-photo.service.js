angular.module('libshareApp')
.service('LibPhotoSrv', ['$uibModal', '$document',function($uibModal, $document){
    var service = {};

    service.open = function(size, parentSelector){
        var parentElem = parentSelector ? 
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;

        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: '../src/directives/lib-photo/lib-photo.tpl.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: 'ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
            }
        });

        return modalInstance.result;
        // modalInstance.result.then(function (selectedItem) {
        //     $ctrl.selected = selectedItem;
        // }, function () {
        //     $log.info('Modal dismissed at: ' + new Date());
        // });
    }

    return service;
}]);