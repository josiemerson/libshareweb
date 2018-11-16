(function(){
    'use strict';

    angular
        .module('lib.directives')
        .directive('LibMapPopup', TextInput);
    
    TextInput.$inject = [];
    
    function TextInput() {
        return {
            // replace : true,// Replace with template
            // transclude : true, // To use custom content
            // link : linker,
            restrict : 'E',
            controller : 'MapPopupCtrl',
            As: 'ctrl',
            scope: {
                profile : '=LibProfile',
                name : '@LibName',
                clickBookcase : '&LibClickBookcase',
                pathImage : '@LibPathimage'
            },
            templateURL: 'mapPopUp.tpl.html'
        }
    
        // function linker(scope, element, attrs) {
        //     scope.windowStyle = {};
    
        //     if (attrs.width) {
        //         scope.windowStyle.width = attrs.width;
        //     }
    
        //     if (attrs.height) {
        //         scope.windowStyle.height = attrs.height;
        //     }
    
        //     scope.hideModal = function () {
        //         scope.show = false;
        //     };
        // }
    }

})();