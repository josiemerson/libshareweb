'use strict';

angular.module('libshareApp')
  .controller('SignupCtrl', ['$scope', '$location', '$rootScope', 'StringUtils', 'RestSrv', 'URLS_SERVICES', 'Memory','$localStorage','LoginLogoutSrv',
    function ($scope, $location, $rootScope, StringUtils, RestSrv, URLS_SERVICES, Memory, $localStorage, LoginLogoutSrv) {
    var self = this;

    self.signup = signup;
    self.showMessageDiffsWithPass = false;
    self.emailIsEmpty = false;
    self.passwordIsEmpty = false;
    self.passwordRepeatIsEmpty = false;
    self.showTeste = false;

    $rootScope.isPageLogin(false);

    function signup() {
      self.emailIsEmpty = false;
      self.passwordIsEmpty = false;
      self.passwordRepeatIsEmpty = false;
      self.showMessageDiffsWithPass = false;

      if (self.email === undefined || self.email === ''){
        self.emailIsEmpty = true;
      }

      if (StringUtils.isEmpty(self.password)){
        self.passwordIsEmpty = true;
      } else if (StringUtils.isEmpty(self.repeatPassword)){
        self.passwordRepeatIsEmpty = true;
      } else {
        if (self.password != self.repeatPassword) {
          self.showMessageDiffsWithPass = true;
        } else if (!StringUtils.isEmpty(self.email)) {
          var data = {
            "email": self.email,
            "password": self.password,
            "permissions": [
              {
                  "id": 2,
                  "role": "ROLE_USER"
              }
            ]
          }
          
          if($rootScope.useMemory){
            saveUserMemory(data);
          } else {

            RestSrv.add(URLS_SERVICES.USER_NEW, data, function(response){
                // $rootScope.dataUser = response;

                LoginLogoutSrv.login(data.email, data.password);

                // $rootScope.authDetails = { name: '', authenticated: true, permissions: [{authority: 'ROLE_USER'}] , 'user' :  $rootScope.dataUser};
                // $localStorage.authDetails = $rootScope.authDetails;

                $rootScope.newUser = true;
                $location.path("/user");
              });
          }
        }
      }
    };

    function saveUserMemory(data){
      $rootScope.newUser = true;

      $rootScope.dataUser = Memory.add('usersMemory', undefined, data);
      $rootScope.authDetails = { name: '', authenticated: true, permissions: ['ROLE_USER'] , 'user' :  $rootScope.dataUser};
      $localStorage.authDetails = $rootScope.authDetails;

      $location.path("/user");
    }
    function DadosSignup(email, password){
      this.email = email;
      this.password = password;
    }
  }]);