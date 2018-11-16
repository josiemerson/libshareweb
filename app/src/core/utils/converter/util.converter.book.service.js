'use strict';

angular.module('libshareApp')
  .constant('TIPOCOMP', {
     'C': 'Compartilhamento', 'V' : 'Venda'
  })
  .service('ConverterBookSrv', ['TIPOCOMP', 'ArrayUtils', function(TIPOCOMP, ArrayUtils) {
    this.converterSiglaToDescTypeShare = function(sigla) {
        return TIPOCOMP[sigla];
    }

    this.converterDescToSiglaTypeShare = function(description) {
        return ArrayUtils.find(TIPOCOMP, function(item, index, arr){
            if (item === description){
              return true;
            }
        });
    }
  }]);
