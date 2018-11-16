'use strict';

angular.module('libshareApp')
  .service('Memory', function($localStorage, ArrayUtils) {
    var memoryService = {};
    $localStorage.usersMemory = {};
    $localStorage.profilesMemory = {};
    $localStorage.booksMemory = {};
    $localStorage.usersMemory_ID = 0;
    $localStorage.profilesMemory_ID = 0;
    $localStorage.booksMemory_ID = 0;

    memoryService.find = function(servico, id, idUser, emailAndSenha, notCopy){
      var find;
      switch(servico){
        case 'usersMemory':
        if (emailAndSenha) {
          find = ArrayUtils.find($localStorage[servico],function(userRoot, index, arr){
              if (userRoot['email'] == emailAndSenha.email) {
                return true;
              } else {
                return false;
              }

          });
  
        } else {
          find =  $localStorage[servico][$localStorage[servico + "_" + id]];
        }
        break;
        
        case 'profilesMemory':
        find =  $localStorage[servico][$localStorage[servico + "_" + id]];
        break;
        
        case 'booksMemory':
        find =  $localStorage[servico][$localStorage["usersMemory_" + idUser][$localStorage[servico + "_" + id ]]];
        break;
        
        defautl:

        break;
      }

      if (notCopy) {
        
        return find;
      } else {

        return angular.copy(find);
      }
    }

    memoryService.add = function (servico, idUser, data, update) {
      var retorno;

      var id;
      if (update) {
        id = update;
      } else {
        id = $localStorage[servico + "_ID" ] + 1;
        $localStorage[servico + "_ID" ] = id;
      }

      var dataCopy = angular.copy(data);
      switch(servico){
        case 'usersMemory':
        $localStorage[servico][$localStorage[servico + "_" + id]] = dataCopy;

          break;
          
        case 'profilesMemory':
        $localStorage[servico][$localStorage[servico + "_" + id]] = dataCopy;
          
          break;
          
        case 'booksMemory':
          $localStorage[servico][$localStorage["usersMemory_" + idUser][$localStorage[servico + "_" + id]]] = dataCopy
          break;
         
        defautl:
          
          break;
        }

        dataCopy.id = id;
        retorno = angular.copy(dataCopy);

        return retorno;

    }

    memoryService.update = function (servico, id, idUser, data) {
      var update = id;
      return this.add(servico, idUser, data, update);
    }

    memoryService.delete = function (servico, id, idUser) {
      var notCopy = true;
      delete this.find(servico, id, idUser, notCopy);
    }

    return memoryService;
  });
