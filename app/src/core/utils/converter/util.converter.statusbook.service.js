'use strict';

angular.module('libshareApp')
  .constant('BOOK_STATUS', {
     'A': 'Alugado', 'D' : 'Disponível', 'E': 'Emprestado', 'V': 'Vendido', 'I': 'Indisponível'
  })
  .service('ConverterStatusBookSrv', ['BOOK_STATUS', 'ArrayUtils', function(BOOK_STATUS, ArrayUtils) {
    this.converterSiglaToDescStatus = function(sigla) {
        return BOOK_STATUS[sigla];
    }

    this.converterDescToSiglaStatus = function(description) {
        return ArrayUtils.find(BOOK_STATUS, function(item, index, arr){
            if (item === description){
              return true;
            }
        });
    }
  }]);
