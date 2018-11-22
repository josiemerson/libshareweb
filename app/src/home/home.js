'use strict';

var BASE_URL = 'http://localhost:8080/api';
var PRIVATE  = BASE_URL + '/private';
var PUBLIC =  BASE_URL + '/public';

angular
.module('libshareApp')
.constant('URLS_SERVICES', {
    'ROOT_PATH': BASE_URL,
    'PUBLIC_PATH': PUBLIC,
    'PRIVATE_PATH': PRIVATE
    ,'BOOKS_BY_USER': PRIVATE + '/bookcase/bookbyuser/'
    ,'BOOKS_BY_ID': PRIVATE +'/bookcase/'
    ,'BOOKS_MY_BOOKS': PRIVATE +'/bookcase/mybooks/'
    ,'BOOKS_NEW': PRIVATE +'/bookcase/bookNew/'
    ,'BOOKS_DELETE': PRIVATE +'/bookcase/bookDelete/'
    ,'BOOKS_EDIT': PRIVATE +'/bookcase/bookEdit/'
    ,'PROFILE': PRIVATE + '/profile/'
    ,'PROFILE_BY_CODUSU': PRIVATE + '/profile/profileByCodUsu/'
    ,'PROFILE_CHANGE_IMAGE': PRIVATE + '/profile/image'
    ,'USER': PRIVATE + '/user'
    ,'USER_BY_ID': PRIVATE + '/user/'
    ,'USER_NEW': PRIVATE + '/user/newUser'
    ,'SHARING_PORTAL': PRIVATE + '/sharingportal/'
    ,'SHARING_PORTAL_NEW': PRIVATE + '/sharingportal/newSharing'
    ,'FRIENDS': PRIVATE + '/friends/'
    ,'FRIENDS_STATUS': PRIVATE + '/friends/statusFriend/'
    ,'FRIENDS_NEW_FRIEND': PRIVATE + '/friends/newFriend/'
})
.controller('HomeCtrl', HomeController);

HomeController.$inject = ['$scope', 'RestSrv'];
    function HomeController( $scope, RestSrv){
        var self = this;

    }