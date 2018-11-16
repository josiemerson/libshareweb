'use strict';

angular.module('libshareApp')
  .constant('GENRE', {
     'A': 'Administração', 'B' : 'Aventura', 'C': 'Direito', 'D': 'Economia', 'E': 'Ficção Cientifica', 'F': 'Fantasia', 'G': 'Geografia e História',
    'H': 'Policial', 'I': 'Religião', 'J' : 'Romance', 'K': 'Terror', 'L' : 'Vida e Crescimento', 'M': 'Diversos'
  })
  .service('ConverterGenreSrv', ['GENRE', 'ArrayUtils', function(GENRE, ArrayUtils) {
    this.converterSiglaToDescGenre = function(sigla) {
        return GENRE[sigla];
    }

    this.converterDescToSiglaGenre = function(description) {
        return ArrayUtils.find(GENRE, function(item, index, arr){
            if (item === description){
              return true;
            }
        });
    }
  }]);
