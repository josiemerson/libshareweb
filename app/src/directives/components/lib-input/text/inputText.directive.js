(function(){
    'use strict';

    angular
        .module('libshareApp')
        .directive('textInput', TextInput);
    
    TextInput.$inject = [];
    
    function TextInput() {
        return {
            scope: {show : '='},
            replace : true,// Replace with template
            transclude : true, // To use custom content
            link : linker,
            restrict : 'E',
            controller : 'TextInputController',
            // template : "<div ng-show='show'>"
            //                 .concat("<div class='modal-overlay' ng-click='hideModal()'></div>")
            //                 .concat("<div class='modal-background' ng-style='windowStyle'>")
            //                     .concat("<div class='modal-close' ng-click='hideModal()'>X</div>")
            //                     .concat("<div class='modal-content' ng-transclude></div>")
            //                 .concat("</div>")
            //             .concat("</div>"),
            templateURL: 'textInput.tpl.html'
            
        }
    
        function linker(scope, element, attrs) {
            scope.windowStyle = {};
    
            if (attrs.width) {
                scope.windowStyle.width = attrs.width;
            }
    
            if (attrs.height) {
                scope.windowStyle.height = attrs.height;
            }
    
            scope.hideModal = function () {
                scope.show = false;
            };
        }
    }

})();