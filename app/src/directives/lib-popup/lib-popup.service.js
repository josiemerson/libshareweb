angular.module('libshareApp')
.service('LibPopUpSrv', ['$uibModal', '$document',function($uibModal, $document){
    var service = {};

    service.open = function(size, parentSelector, params){
        var parentElem = parentSelector ? 
            angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;

        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: params.templateUrl,
            // templateUrl: '../src/directives/lib-photo/lib-photo.tpl.html',
            // controller: 'ResponseSharingCtrl',
            controller: params.controller,
            controllerAs: 'ctrl',
            size: size,
            appendTo: parentElem,
            resolve: {
                data: params.data ? params.data : undefined
            }
        });

        return modalInstance.result;
    }

    return service;
}]);