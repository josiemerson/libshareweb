'use strict';

angular.module('libshareApp')
  .constant('BOOK_STATUS', {
     'A': 'Alugado', 'D' : 'Disponível', 'E': 'Emprestado', 'V': 'Vendido', 'I': 'Indisponível'
  })
  .constant('ITEM_SHARING_STATUS', {
     'L': 'Liberado', 'N' : 'Negado', 'P': 'Pendente'
  })
  .service('ConverterStatusSrv', ['BOOK_STATUS', 'ArrayUtils', 'ITEM_SHARING_STATUS', function(BOOK_STATUS, ArrayUtils, ITEM_SHARING_STATUS) {
    this.converterSiglaToDescStatusBook = function(sigla) {
        return BOOK_STATUS[sigla];
    }

    this.converterDescToSiglaStatusBook = function(description) {
        return ArrayUtils.find(BOOK_STATUS, function(item, index, arr){
            if (item === description){
              return true;
            }
        });
    }
    this.converterSiglaToDescStatusItemSharing = function(sigla) {
        return ITEM_SHARING_STATUS[sigla];
    }

    this.converterDescToSiglaStatusItemSharing = function(description) {
        return ArrayUtils.find(ITEM_SHARING_STATUS, function(item, index, arr){
            if (item === description){
              return true;
            }
        });
    }
  }]);
