angular.module('lib.directives')
    .controller('MapPopupCtrl', [function(scope){
        var self = this;

        self.clickBookcase = clickBookcase;

        function clickBookcase(){
            if (typeof scope.clickBookcase  == 'Function') {
                scope.clickBookcase({profile: self.profile});
            }
        }
    }]);