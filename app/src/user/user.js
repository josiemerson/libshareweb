'use strict';

angular.module('libshareApp')
  .controller('UserCtrl', ['$scope', '$http', 'ngNotify', 'RestSrv', 'SERVICE_PATH', '$rootScope', '$location', 'StringUtils', 'ImageSrv', 'URLS_SERVICES'
  ,'Memory','MsgHttpSrv', 'MsgUtils','LibPhotoSrv',
    function($scope, $http, ngNotify, RestSrv, SERVICE_PATH, $rootScope, $location, StringUtils, ImageSrv, URLS_SERVICES, Memory, MsgHttpSrv, MsgUtils
      ,LibPhotoSrv) {
    var self = this;

    self.user = {};
    self.profile = {};
    self.showAddEditUser = true;
    self.hide = hide;
    self.deleteUser = deleteUser;
    self.saveUser = saveUser;
    // self.upload = upload;
    self.clickCancel = clickCancel;
    self.alterarImage = alterarImage;
    self.regionCity = [
      {key: '1', value: 'Norte'},
      {key: '2', value: 'Nordeste'},
      {key: '3', value: 'Leste'},
      {key: '4', value: 'Sudeste'},
      {key: '5', value: 'Sul'},
      {key: '6', value: 'Sudoeste'},
      {key: '7', value: 'Oeste'},
      {key: '8', value: 'Noroeste'}
    ];

    self.showImage = false;
    // self.imageProfile = ImageSrv.buildUrlImage(0,undefined, undefined);

    var userDetails = $rootScope.authDetails.user;

    init();
    function init() {
      self.uploadImageUrl = URLS_SERVICES.PROFILE_CHANGE_IMAGE;
      self.user = userDetails;

      if ($rootScope.newUser) {
        $rootScope.newUser = false;
        self.profile = addInfoCountry({codUsu: userDetails.id});
        self.profile.allowShowPhone = false;
        self.imageProfile = ImageSrv.buildUrlImage(0,undefined, undefined);
      } else if (!StringUtils.isEmpty(userDetails)) {

        RestSrv.find(URLS_SERVICES.USER_BY_ID + userDetails.id, function(data){
          if (data && data.hasOwnProperty('msg')) {

            self.profile = addInfoCountry({codUsu: userDetails.id});
            self.imageProfile = ImageSrv.buildUrlImage(0,undefined, undefined);
          } else {
            self.profile = data.profile;
            self.user = data;

            if (StringUtils.isEmpty(self.profile)){
              self.profile = {};
              self.profile = addInfoCountry(self.profile);
              addPropIfNotExists(self.profile, 'codUsu', userDetails.id);
              self.imageProfile = ImageSrv.buildUrlImage(0,undefined, undefined);
            } else {
              self.profile.allowShowPhone = self.profile.allowShowPhone == 'S';
              
              self.imageProfile = ImageSrv.buildUrlImage(userDetails.id,self.profile.pathFoto, undefined);

              convertToDate(self.profile);
            }
          }
        });
      }
    }

    function convertToDate(profile){
      if (profile && profile.hasOwnProperty('dateBirth') && profile.dateBirth) {
        profile.dateBirth = new Date(profile.dateBirth);
      }
    }

    function addInfoCountry(obj){
      obj.city = 'Uberlândia';
      obj.state = 'Minas Gerais';
      obj.country = 'Brasil';
      return obj;
    }

    function clickCancel(){
      self.disabledCancel = true;
    }

    function deleteUser(user) {
      RestSrv.delete(userUrl, user, function() {
        $scope.users.splice($scope.users.indexOf(user), 1);
        ngNotify.set('User \'' + self.profile.name + '\' deleted.', 'success');
      });
    };

    function saveUser(user) {
      saveByUser();
    };

    function addPropIfNotExists(obj, property, value){
      if (obj && !obj.hasOwnProperty(property)) {
        obj[property] = value;
      }
    }

    function saveByUser(){
      addPropIfNotExists(self.profile, 'codUsu', userDetails.id);
      addPropIfNotExists(self.profile, 'active', 'S');
      addPropIfNotExists(self.profile, 'latLong',  buildLatLong(self.profile.codUsu));
      addInfoCountry(self.profile);

      self.profile.pathFoto = treatmentImgSave(self.imageProfile);
      self.profile.allowShowPhone =  treatmentBooleanInString(self.profile.allowShowPhone);
      self.user.profile = self.profile;

      RestSrv.edit(URLS_SERVICES.USER, self.user, function() {

        ngNotify.set('Perfil \'' + self.profile.name + '\' atualizado.', 'success');
      });
    }

    function treatmentImgSave(img){
      if (img.indexOf('112312s3ko13a123xomnajcnhasuser.png') > -1) {
         img = '112312s3ko13a123xomnajcnhasuser.png';
      } else if (img.indexOf('base64') > -1){
        img = self.fileSelected.filename + "_filename@"+ img;
      }

      return img;
    }

    function hide(){
      $location.path('/');
    }

    function buildLatLong(id){
      var latLong = 
      'Lat:-18.92201' + (id + 10) + ';Long:-48.31503' + (id + 10); 
      return latLong;
    }

    // function upload(file){
    //   self.showImage = true;

    //   file.upload = Upload.http({
    //     url: URLS_SERVICES.PROFILE_CHANGE_IMAGE,
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': file.type
    //     },
    //     data: file
    //   });
  
    //   file.upload.then(function (response) {
    //     file.result = response.data;
    //   }, function (response) {
    //     if (response.status > 0)
    //       $scope.errorMsg = response.status + ': ' + response.data;
    //   });
  
    //   file.upload.progress(function (evt) {
    //     file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    //   });
    // }

    function alterarImage(){
      LibPhotoSrv.open().then(function(fileSelected){
        self.fileSelected = fileSelected;
        var img = 'data:' + fileSelected.filetype + ';base64,' + fileSelected.base64;
        self.imageProfile = img;
      }, function(){
//cancel
      });
    }

    function treatmentBooleanInString(value){
      var retorno = "N";
      if (value) {
        retorno = value ? "S": "N"; 
      }

      return retorno;
    }

    
  }]);