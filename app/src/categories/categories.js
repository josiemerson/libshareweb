'use strict';

angular
.module('libshareApp')
.constant('URLS_CATEGORIES', {
    'BOOK_CATEGORIES': '/profile/bookgenre/'
})
.controller('CategoriesCtrl', ['$location', 'Transporter', '$window', '$rootScope', '$localStorage', 'LoginLogoutSrv', 
function($location, Transporter, $window, $rootScope, $localStorage, LoginLogoutSrv){
    var self = this;
    var BOOK_CATEGORIES = '';
    
    self.genre = { ADMINISTRACAO: 'A', AVENTURA:'B', DIREITO: 'C', ECONOMIA : 'D', FICCAOCIENTIFICA : 'E', FANTASIA : 'F', GEOGRAFIA_E_HISTORIA : 'G',
       POLICIAL : 'H', RELIGIAO : 'I', ROMANCE: 'J', TERRO : 'K', VIDA_E_CRESCIMENTO : 'L', DIVERSOS: 'M'}

    self.getPeoplesPerGenre = getPeoplesPerGenre;
    $rootScope.isPageLogin(false);

    init()
    function init(){
        LoginLogoutSrv.verifyAuth();
    }

    function getPeoplesPerGenre(genre){
        $location.path("/books");
        $rootScope.categoriesFind = {'genre' : genre}
        $localStorage.categoriesFind = {'genre' : genre};

        // Transporter.setData('categories', {'genre': genre});
        // $window.localStorage.setItem('lib.categories', {'genre' : genre});
    }
}]);