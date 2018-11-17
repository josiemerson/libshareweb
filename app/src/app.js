'use strict';

var BASE_URL = 'http://localhost:8080/api';

agGrid.initialiseAgGridWithAngular1(angular);

angular.module('libshareApp', ['checklist-model', 'agGrid', 'ngNotify', 'ngRoute', 'ngCookies', 'ngStorage', 'ngAnimate','ngSanitize','ui.bootstrap', 'naif.base64'])
  .constant('SERVICE_PATH', {
    'ROOT_PATH': BASE_URL,
    'PUBLIC_PATH': BASE_URL + '/public',
    'PRIVATE_PATH': BASE_URL + '/private'
  })
  .config(function($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider.
      when('/', {
        templateUrl: 'src/home/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'ctrl'
      })
      .when('/bookcase', {
        templateUrl: 'src/bookcase/bookcase.html',
        controller: 'BookCaseCtrl',
        controllerAs: 'ctrl'
      })
      .when('/bookcasemy', {
        templateUrl: 'src/bookcasemy/bookcasemy.html',
        controller: 'BookCaseMyCtrl',
        controllerAs: 'ctrl'
      })
      .when('/books', {
        templateUrl: 'src/books/mapBooks.html',
        controller: 'MapBooksCtrl',
        controllerAs: 'ctrl'
      })
      .when('/categories', {
        templateUrl: 'src/categories/categories.html',
        controller: 'CategoriesCtrl',
        controllerAs: 'ctrl'
      })
      .when('/favorites', {
        templateUrl: 'src/favorites/favorites.html',
        controller: 'FavoritesCtrl',
        controllerAs: 'ctrl'
      })
      .when('/friends', {
        templateUrl: 'src/friends/friends.html',
        controller: 'FriendsCtrl',
        controllerAs: 'ctrl'
      })
      .when('/login', {
        templateUrl: 'src/login/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'ctrl'
      })
      .when('/profile', {
        templateUrl: 'src/user/user.html',
        controller: 'UserCtrl',
        controllerAs: 'ctrl'
      })
      .when('/sharingportal', {
        templateUrl: 'src/sharingportal/sharingportal.html',
        controller: 'SharingPortalCtrl',
        controllerAs: 'ctrl'
      })
      .when('/signup', {
        templateUrl: 'src/signup/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'ctrl'
      })
      .when('/user', {
        templateUrl: 'src/user/user.html',
        controller: 'UserCtrl',
        controllerAs: 'ctrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($httpProvider) {
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('httpRequestInterceptor');
  })
  .run(['$rootScope', 'ngNotify', 'LoginLogoutSrv', function($rootScope, ngNotify, LoginLogoutSrv) {
    $rootScope.authDetails = { name: '', authenticated: false, permissions: [] };
    $rootScope.useMemory = false;

    ngNotify.config({
      theme: 'pastel'
    });

    LoginLogoutSrv.verifyAuthSetDataStorage();
  }])
.controller('IndexController',['MapsLoad', '$scope', function(MapsLoad, $scope){
  var self = this;

}]);