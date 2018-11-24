'use strict';

angular.module('libshareApp')
  .service('ImageSrv', ['URL_IMAGE', 'StringUtils', function(URL_IMAGE, StringUtils) {
    var servicesImg = {};

    servicesImg.buildUrlImage = function (idUser, pathFoto,idBook,bookDefault){
      var imageDefault = bookDefault ? "112312s3ko13a123xomnajcnhasbookLibshare.png": "112312s3ko13a123xomnajcnhasuser.png";
      var urlImage = "../";
      if (!StringUtils.isEmpty(pathFoto)) {
        if (pathFoto === '112312s3ko13a123xomnajcnhasbookLibshare.png'){
          urlImage = urlImage + URL_IMAGE.USERS + '112312s3ko13a123xomnajcnhasbookLibshare.png';
        } else if (!StringUtils.isEmpty(idBook)) {

          urlImage =  urlImage + URL_IMAGE.USERS_ID + idUser + URL_IMAGE.BOOKS + pathFoto;
        } else {
          
          urlImage = urlImage + URL_IMAGE.USERS_ID + idUser + '/' + pathFoto;
        }
      } else  if (bookDefault){
        
        urlImage = urlImage + URL_IMAGE.USERS + imageDefault;
      } else {
        
        urlImage = urlImage + URL_IMAGE.USERS + imageDefault;
      }
      
      return urlImage;
    }

    servicesImg.treatmentUrlImage = function (imgWithSrcComplet){
      var retorno;
      // users/ID_1/books/ID_1_camadegato.jpg
      if (imgWithSrcComplet === '../../img/users/112312s3ko13a123xomnajcnhasbookLibshare.png'){
        retorno = "112312s3ko13a123xomnajcnhasbookLibshare.png";
      } else {
        var arrbook = imgWithSrcComplet.split('books/');
        retorno = arrbook[1];
      }

      return retorno;
    }

    servicesImg.treatmentSaveImgBook = function(filename, user, img){
        if (img.indexOf('112312s3ko13a123xomnajcnhasbookLibshare.png') > -1) {
            img = "112312s3ko13a123xomnajcnhasbookLibshare.png";
        } else if (img.indexOf('base64') > -1){
          img = user + "_user@" + filename + "_filename@"+ img;
        } else {
          img = undefined;
        }

     return img;
    }

    return servicesImg;
  }]);