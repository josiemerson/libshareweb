'use strict';

angular.module('libshareApp')
  .controller('BookCaseMyCtrl', ['Transporter', 'StringUtils', 'ConverterGenreSrv', 'ArrayUtils', 'RestSrv', 'ImageSrv', 'URLS_SERVICES', 'ConverterStatusSrv',
    'ngNotify', '$window', '$rootScope', 'DateUtils', 'MsgUtils', 'LibPhotoSrv', 'ConverterBookSrv','LoginLogoutSrv',
  function(Transporter, StringUtils, ConverterGenreSrv, ArrayUtils, RestSrv, ImageSrv, URLS_SERVICES, ConverterStatusSrv, ngNotify,$window, $rootScope, 
    DateUtils, MsgUtils, LibPhotoSrv, ConverterBookSrv, LoginLogoutSrv) {
    var self = this;
    
    const ALL_CATEGORIES = 'T';
    self.listBooksCarOfKnowing = [];
    self.qtdAddBooks = 0;
    $rootScope.isPageLogin(false);
    self.openCarKnowing = openCarKnowing;
    self.removeBookOfList = removeBookOfList;
    self.visibleListCarOfBooks = false;
    self.titleDinamic = 'Estante do conhecimento';

    self.removeBook = removeBook;
    self.addBook = addBook;
    self.editBook = editBook;
    self.backToList = backToList;
    self.changeImage = changeImage;
    self.saveBook = saveBook;
    self.cancelBook = cancelBook;
    self.alterarImage = alterarImage;
    self.changeGenero = changeGenero;
    self.changeStatusBook = changeStatusBook;
    self.changeSharingType = changeSharingType;

    self.bookAddEdit = {};
    self.newOrEditBook = false;
    self.bookStatusOptions = [
        { key: 'D', value: 'Disponível'},
        { key: 'E', value: 'Emprestado'},
        { key: 'V', value: 'Vendido'},
    ];
    self.bookGenreOptions = [
        { key: 'A', value: 'Administração'},
        { key: 'B', value: 'Aventura'},
        { key: 'C', value: 'Direito'},
        { key: 'D', value: 'Economia'},
        { key: 'E', value: 'Ficção Cientifica'},
        { key: 'F', value: 'Fantasia'},
        { key: 'G', value: 'Geografia e História'},
        { key: 'H', value: 'Policial'},
        { key: 'I', value: 'Religião'},
        { key: 'J', value: 'Romance'},
        { key: 'K', value: 'Terror'},
        { key: 'L', value: 'Vida e Crescimento'},
        { key: 'M', value: 'Diversos'},
    ];

    self.sharingTypeOptions = [
      {key: 'C', value: 'Compartilhamento'},
      {key: 'V', value: 'Venda'}
    ];
    

    init();
    function init(){
      if(LoginLogoutSrv.verifyAuth()){
        loadAllBooksByUser();
      }
    }

    function convertLancamento(dtLanc){
      var data = new Date(dtLanc);

      return DateUtils.formatDate(data);;
    }

    function openCarKnowing(){
      self.visibleListCarOfBooks = true;
      self.titleDinamic = 'Cesta do conhecimento';
    }

    function removeBookOfList(book) {
        self.listBooksCarOfKnowing.forEach(function(itemBook, index, arr) {
          if (itemBook.id == book.id) {
            arr.splice(index, 1);
          }
        });

        if (self.listBooksCarOfKnowing.length == 0){
            self.visibleListCarOfBooks = false;
            self.qtdAddBooks = self.qtdAddBooks - 1;
            self.titleDinamic = 'Estante do conhecimento';
        }

        self.books.forEach(function(item, index, arr){
          if (item.id === book.id){
            item.bookStatus = ConverterStatusSrv.converterSiglaToDescStatusBook('D');
            item.bookStatusOrig = 'D';
            item.statusBookcase = 'onStatusBookcase';
          }
        });
    }
//// Começa aqui

    function loadAllBooksByUser() {
      self.userDetails = $rootScope.authDetails;
      var user = self.userDetails.user;

      if (user.id){
        self.codUsu = user.id;

        var complementUrl = user.id + "/" + ALL_CATEGORIES;
        RestSrv.find(URLS_SERVICES.BOOKS_MY_BOOKS + complementUrl, function(response){
          if (StringUtils.isEmpty(response)){
            MsgUtils.showAlert("Usuário não possui livros cadastrados.");
            self.books = [];
          } else {

            self.books = bookTreatment(response);
          }
        });
      } else {
        MsgUtils.showError('Houve um erro ao carregar os dados do usuário, entre em contato com a LibShare.');
      }
    }

    function removeBook(book){
      RestSrv.delete(URLS_SERVICES.BOOKS_DELETE, book, function(response){
        self.books.splice(self.books.indexOf(book), 1);
      });
    };

    function addBook(){
      self.bookAddEdit = {};
      //Pegar imagem padrão de book
      self.bookAddEdit.pathFoto = ImageSrv.buildUrlImage(self.codUsu, null,  null, true);
      self.newOrEditBook = true;
      self.addBookMode = true;
    }

    function editBook(book){
      book.releaseYear = new Date(book.releaseYear);
      self.bookAddEdit = book;
      self.newOrEditBook = true;
      self.addBookMode = false;
    }

    function bookTreatment(books){
      books.forEach(function(item, index, arr) {
        item.genrePresentation = ConverterGenreSrv.converterSiglaToDescGenre( item.genre);

        if (item.bookStatus == 'D') {

          item.statusBookcase = 'onStatusBookcase';
        } else {

          item.disabledBookCase = 'disabledBookCase';
          item.statusBookcase = 'ofStatusBookcase';
        }

        item.bookStatusPresentation = ConverterStatusSrv.converterSiglaToDescStatusBook(item.bookStatus);
        item.sharingTypePresentation = ConverterBookSrv.converterSiglaToDescTypeShare(item.sharingType);

        var bookDefault = true;
        item.pathFoto = ImageSrv.buildUrlImage(self.codUsu, item.pathFoto, item.id, bookDefault);

        item.releaseYear = convertLancamento(item.releaseYear);
      });

      return books;
    }

    function backToList() {
      self.newOrEditBook = false;
      self.bookAddEdit = {};
    }

    function changeImage() {
      window.alert('Change Image Not Implemented!');
    }

    function saveBook(book){
      addPropIfNotExists(book, 'bookOwner', self.codUsu);
      var copyBook;
      if (self.addBookMode) {
        //../../img/users/book.png
        copyBook = angular.copy(book);
        var filename = "";
        if (self.fileSelected) {
          filename = self.self.fileSelected.filename;
        }

        copyBook.pathFoto = ImageSrv.treatmentSaveImgBook(filename, self.codUsu, copyBook.pathFoto);
        //adicionar book
        RestSrv.add(URLS_SERVICES.BOOKS_NEW, copyBook, function(response){
          book.id = response.id;
          self.books.push(book);
          self.newOrEditBook = false;
        });
      } else {
        copyBook = angular.copy(book);

        var filename = "";
        if (self.fileSelected) {
          filename = self.self.fileSelected.filename;
        }

        copyBook.pathFoto = ImageSrv.treatmentSaveImgBook(filename, self.codUsu, copyBook.pathFoto);
        //editbook
        RestSrv.edit(URLS_SERVICES.BOOKS_EDIT, copyBook, function(response){
          self.newOrEditBook = false;
          book.releaseYear = new Date(book.releaseYear);
        });
      }
    }
  
    function cancelBook(){
      self.bookAddEdit = {};
      self.addBookMode = false;
      self.newOrEditBook = false;
    }

    
    function addPropIfNotExists(obj, property, value){
      if (obj && !obj.hasOwnProperty(property)) {
        obj[property] = value;
      }
    }

    function alterarImage(){
      LibPhotoSrv.open().then(function(fileSelected){
        if (fileSelected){

          var img = 'data:' + fileSelected.filetype + ';base64,' + fileSelected.base64;
          self.bookAddEdit.pathFoto = img;
          self.fileSelected = fileSelected;          
        } else {
          MsgUtils.showAlert("Nenhuma imagem escolhida.");
        }
      }, function(){
//cancel
      });
    }

    function changeGenero() {
      self.bookAddEdit.genrePresentation = ConverterGenreSrv.converterSiglaToDescGenre(self.bookAddEdit.genre);
    }
    function changeStatusBook() {
      self.bookAddEdit.bookStatusPresentation = ConverterGenreSrv.converterSiglaToDescGenre(self.bookAddEdit.bookStatus);
    }
    function changeSharingType() {
      self.bookAddEdit.sharingTypePresentation = ConverterGenreSrv.converterSiglaToDescGenre(self.bookAddEdit.sharingType);
    }
  }]);
