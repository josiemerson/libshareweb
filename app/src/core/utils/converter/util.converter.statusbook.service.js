'use strict';

angular.module('libshareApp')
  .constant('BOOK_STATUS', {
     'A': 'Alugado', 'D' : 'Disponível', 'E': 'Emprestado', 'V': 'Vendido', 'I': 'Indisponível'
  })
  .constant('ITEM_SHARING_STATUS', {
     'A': 'Aprovado', 'N' : 'Negado', 'P': 'Pendente'
  })
  .constant('TYPE_SHARING', {
     'C': 'Compartilhamento', 'V' : 'Venda'
  })
  .service('ConverterStatusSrv', ['BOOK_STATUS', 'ArrayUtils', 'ITEM_SHARING_STATUS', 'TYPE_SHARING',
   function(BOOK_STATUS, ArrayUtils, ITEM_SHARING_STATUS, TYPE_SHARING) {
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

    this.converterSiglaToDescTypeItemSharing = function(sigla) {
        return TYPE_SHARING[sigla];
    }

    this.converterDescToSiglaTypeItemSharing = function(description) {
        return ArrayUtils.find(TYPE_SHARING, function(item, index, arr){
            if (item === description){
              return true;
            }
        });
    }
  }]);
