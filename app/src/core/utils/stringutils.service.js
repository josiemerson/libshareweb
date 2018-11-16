angular
    .module('libshareApp')
    .service('StringUtils', [function(){
        var self = this;

        self.isEmpty = isEmpty;

        function isEmpty(value){
            var isEmpty = false;

            if (angular.isUndefined(value) || value == null) {

                isEmpty = true;
            } else {

                value  = value.toString();
                value  = value.trim();

                if (value.length ===0) {

                    isEmpty = true;
                }
            }

            return isEmpty;
        }
      
    }]);
