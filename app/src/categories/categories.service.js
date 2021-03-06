'use strict';

angular
.module('libshareApp')
.service('CategoriesSrv', ['RestSrv', 'SERVICE_PATH', 'URLS_CATEGORIES', function(RestSrv, SERVICE_PATH, URLS_CATEGORIES){ 
    var self = this;
    var services = {};

    services.findProfileByCategoriesWithoutUserLogged = function (params, callback){
        var url = SERVICE_PATH.PRIVATE_PATH + URLS_CATEGORIES.BOOK_CATEGORIES + params.genre + "/" + params.userLogged;
    
        var catchError = true;
        RestSrv.find(url, function(dataResponse){
            callback(dataResponse);
        }, catchError);
    }

    services.findProfileByCategories = function (genre, callback){
        var url = SERVICE_PATH.PRIVATE_PATH + URLS_CATEGORIES.BOOK_CATEGORIES + genre;

        var catchError = true;
        RestSrv.find(url, function(dataResponse){
            callback(dataResponse);
        }, catchError);
    }

    return services;
}]);