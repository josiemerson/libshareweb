'use strict';

angular.module('libshareApp')
  .controller('BookCaseCtrl', ['Transporter', 'StringUtils', 'ConverterGenreSrv', 'ArrayUtils', 'RestSrv', 'ImageSrv', 'URLS_SERVICES', 'ConverterStatusBookSrv',
    'ngNotify', '$window', '$rootScope', 'DateUtils','MsgUtils', 'ConverterBookSrv', 'LoginLogoutSrv',
  function(Transporter, StringUtils, ConverterGenreSrv, ArrayUtils, RestSrv, ImageSrv, URLS_SERVICES, ConverterStatusBookSrv, ngNotify,$window, $rootScope, 
    DateUtils, MsgUtils, ConverterBookSrv, LoginLogoutSrv) {
    var self = this;
    
    self.addCeste = addCeste;

    const ALL_GENRES = 'T';
    self.listBooksCarOfKnowing = [];
    self.qtdAddBooks = 0;
    $rootScope.isPageLogin(false);
    self.openCarKnowing = openCarKnowing;
    self.removeBookOfList = removeBookOfList;
    self.concluirSolicitation = concluirSolicitation;
    self.backToList = backToList;
    self.addOrRemoveFriend = addOrRemoveFriend;

    self.visibleListCarOfBooks = false;
    self.titleDinamic = 'Livros';
    self.typeBtnFriend = 'btn-success';//quando não for amigo
    self.descriptionFriend = 'Solicitar amizade';
    self.statusFriend = '';
    // self.datatoggle = 'dropdown';
    // self.typeBtnFriend = 'btn-danger';//quando já for amigo
    // self.statusFriends = 'Desfazer amizade';
    // self.typeBtnFriend = 'dropdown-toggle';//quandor estiver pendente
    // self.statusFriends = 'Aguardando resposta';
    // self.classStatusFriend = 'caret';
    // self.statusFriend = 'P';

    init();
    function init(){
      if(LoginLogoutSrv.verifyAuth()){
          // self.dataOfBooksProfile = Transporter.getData('books');
          // self.dataCategories = Transporter.getData('categories');
          self.dataOfBooksProfile =  $rootScope.userBooksFind;
          self.dataCategories = $rootScope.categoriesFind;

          var profile = {  "id": 1,
                            "active": "S",
                            "name": "Josiemerson",
                            "lastName": "Souza Lacerda",
                            "address": "Alameda José de Oliveira Guimarães",
                            "neighborhood": "Jardim Holanda",
                            "city": "Uberlândia",
                            "state": "MG",
                            "country": "Brasil",
                            "dateBirth": 1526007600000,
                            "number": 707,
                            "complement": "Apt 102 bloco 9",
                            "telephone": "(34) 99147-0363",
                            "cep": "38412234",
                            "pathFoto": "josiemerson.jpg",
                            "latLong": "Lat:-18.9220192;Long:-48.3150347"
                        };
                        
          self.userDetails = $rootScope.authDetails.user;

          if (self.dataOfBooksProfile && self.dataOfBooksProfile.hasOwnProperty('profile')) {
            self.profile = self.dataOfBooksProfile.profile;
            profile = self.profile;
            self.imageProfile = ImageSrv.buildUrlImage(profile.id, profile.pathFoto);

            findStatusFriends()
          } else {

            self.imageProfile = ImageSrv.buildUrlImage(null, null);
          }

          getBooksByUser(profile.id, function(books){
            self.books = books;
        
                    // self.nameUser = profile.name + ' ' + profile.lastName;
                    // self.ageUser = DateUtils.getToday() - DateUtils.timestampToDate(profile.dateBirth);
                    // self.ageUser = 26;
          });
      }
    }

    function addCeste(book) {
      book.disabledBookCase = 'disabledBookCase';

      book.bookStatus = 'I';
      book.statusBookcase = 'ofStatusBookcase';
      book.bookStatusPresentation = ConverterStatusBookSrv.converterSiglaToDescStatus('I');

      self.listBooksCarOfKnowing.push(book);
      self.qtdAddBooks = self.qtdAddBooks + 1;
    }

    function getBooksByUser(idUser, callback) {
      var url =  URLS_SERVICES.BOOKS_BY_USER + idUser;
      if (self.dataCategories && self.dataCategories.hasOwnProperty('genre')) {
        
        url = url + "/" + self.dataCategories.genre;
      } else {

        url = url + "/" + ALL_GENRES;
      }

      RestSrv.find(url, function(response){
        var buildResponse = function (booksResponse) {
          if (booksResponse) {
            var books = booksResponse;

            books.forEach(function(item, index, arr) {
              item.genrePresentation = ConverterGenreSrv.converterSiglaToDescGenre( item.genre);

              if (item.bookStatus == 'D') {

                item.statusBookcase = 'onStatusBookcase';
              } else {

                item.disabledBookCase = 'disabledBookCase';
                item.statusBookcase = 'ofStatusBookcase';
              }

              item.bookStatusPresentation = ConverterStatusBookSrv.converterSiglaToDescStatus(item.bookStatus);
              item.sharingTypePresentation = ConverterBookSrv.converterSiglaToDescTypeShare(item.sharingType);
              item.pathFoto = ImageSrv.buildUrlImage(idUser, item.pathFoto, item.id);
              item.releaseYear = convertLancamento(item.releaseYear);
            });

            callback(books);
          } else {
            ngNotify.set('Erro: Usuário não possuí livro cadastrado, na categoria escolhida.', 'error');
          }
        };

        if (response.status == '404') {

          buildResponse(response.data);

          ngNotify.set('Erro: Usuário não possuí livro cadastrado, na categoria escolhida.', 'error');
        } else {
          
          buildResponse(response);
        }
      }, true);
    }

    function convertLancamento(dtLanc){
      var data = new Date(dtLanc);

      return DateUtils.formatDate(data);;
    }

    function openCarKnowing(){
      self.visibleListCarOfBooks = true;
      self.titleDinamic = 'Solicitação de compartilhamento';
    }

    function removeBookOfList(book) {
        self.listBooksCarOfKnowing.forEach(function(itemBook, index, arr) {
          if (itemBook.id == book.id) {
            arr.splice(index, 1);
          }
        });

        self.qtdAddBooks = self.qtdAddBooks - 1;
        if (self.listBooksCarOfKnowing.length == 0){
            self.visibleListCarOfBooks = false;
            self.titleDinamic = 'Livros';
        }

        self.books.forEach(function(item, index, arr){
          if (item.id === book.id){
            item.bookStatusPresentation = ConverterStatusBookSrv.converterSiglaToDescStatus('D');;
            item.bookStatus = 'D';
            item.statusBookcase = 'onStatusBookcase';
            item.disabledBookCase = '';
          }
        });
    }

    function concluirSolicitation (){
      var continueSolicitation = true;
      for (var i=0; i < self.listBooksCarOfKnowing.length; i++) {
        var item = self.listBooksCarOfKnowing[i];

        if (StringUtils.isEmpty(item.devolutionDate)){
          MsgUtils.showError('É necessário preencher todos os campos Dt. Devolução.');
          continueSolicitation = false;
          break;
        }
      };

      if (continueSolicitation) {

        var sharing= {
          userOrigin: self.userDetails.id,
          userDestiny: self.profile.id,
          sharingItem: [],// Valor do compartilhamento
          sharingDateAndHour: '', //data e hora do compartilhamento
          sharingValue: ''
          // sharingType: '',//Tipo de compartilhamento Venda ou compra
          // devolutionDate: '',// Data da devolução
          // limitDate: '',//data limite para devolução
        };
  
        var sumSharingValue = 0;
  
        self.listBooksCarOfKnowing.forEach(function(item, index, arr){
          
          if (!StringUtils.isEmpty(item.sharingItemValue) && item.sharingItemValue > 0){
            sumSharingValue += item.sharingItemValue;
          }  

          
          var sharingItem = {
            sharingType: item.sharingType,//Tipo de compartilhamento Venda ou compra
            devolutionDate: item.devolutionDate,//Data da devolução
            sharingItemValue: item.sharingItemValue,//Valor do item no caso o livro
            book: item
          } ; 

          removeProperties(sharingItem.book, ["genrePresentation", "statusBookcase", "bookStatusPresentation", "disabledBookCase", "devolutionDate"]);
  
            var sharingItemCopy = angular.copy(sharingItem);
            //Fazemos isso para que o item referente ao livro não seja alterado pelo próximo sharingItem;
            sharing.sharingItem.push(sharingItemCopy);
        });
  
        sharing.sharingValue = sumSharingValue;
  
        //utilizar no callback da chamada de serviço
        RestSrv.add(URLS_SERVICES.SHARING_PORTAL_NEW, sharing, function(response){
            $.unblockUI;
        })

        $.blockUI({
          message: 'Enviando solicitação'
          ,css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' 
        } }); 
        setTimeout($.unblockUI, 2000); 
      }              
    }

    function backToList(){
      self.visibleListCarOfBooks = false;
      self.titleDinamic = "Livros";
    }

    function removeProperties(item, arrPropDelete) {
      for (var prop in item) {
        for (var i = 0; i < arrPropDelete.length; i++){
          if (arrPropDelete[i] == prop) {
            delete item[prop];
            break;
          }
        }
      }
    }

    function findStatusFriends(){
      RestSrv.find('',function(response){

      });
    }

    function addOrRemoveFriend (statusFriends) {
      if (StringUtils.isEmpty(statusFriends)){
        //Adicionando usuário passaremos para aguardando resposta (Pendente)
        self.typeBtnFriend = '';//quandor estiver pendente
        self.descriptionFriend = 'Aguardando resposta';
        self.classStatusFriend = 'caret';
        self.statusFriend = 'P';
      } else if (statusFriends === 'P' || statusFriends === 'A'){
        //quando já fizer solicitação e quiser cancelar
        self.typeBtnFriend = 'btn-success';
        self.descriptionFriend = 'Solicitar amizade';
        self.statusFriend = '';
      }
    }

  }]);
