(function(){
    'use strict';

    angular
        .module('libshareApp')
        .directive('libCheckbox', LibCheckbox);

        LibCheckbox.$inject = ['StringUtils'];

        function LibCheckbox(StringUtils) {
            return {
                restrict : 'E',
                scope: {
                    label: '@libLabel',
                    model: '=libModel'
                },
                templateURL: 'lib-checkbox.tpl.html',
                link : function (scope, $element, attrs){
                    var label = scope.label;
                }
            }
        }
})()