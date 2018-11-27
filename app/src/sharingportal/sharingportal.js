'use strict';

angular.module('libshareApp')
  .controller('SharingPortalCtrl', 
  function($scope, RestSrv, URLS_SERVICES, DateUtils,$rootScope, $timeout, LoginLogoutSrv, ConverterStatusSrv, ArrayUtils, StringUtils, MsgUtils, $localStorage) {
    var self = this;

    self.showFilter = true;
    self.gridOptions = {
      columnDefs: getColumnDefs('sharing'),
      rowData: null,
      onSelectionChanged: onSelectionChanged,
      onRowSelected: onRowSelected,
    };

    self.gridOptionsItens = {
      columnDefs: getColumnDefs('sharingItem'),
      rowData: null,
      onSelectionChanged: onSelectionChangedItem,
      onRowSelected: onRowSelectedItem,
    };

    self.statusBookOptions = [
      {key: 'A', value: 'Aprovado'}
      ,{key: 'N', value: 'Negado'}
      ,{key: 'P', value: 'Pendente'}
    ];

    self.statusBook = "P";

    self.sharingWithMeOptions = [
      {key: 'A', value: 'Com ambos'}
      ,{key: 'C', value: 'Comigo'}
      ,{key: 'P', value: 'Por mim'}
    ];

    self.sharingWithMe = 'A';

    self.findSharing = findSharing;

    var arrSharingItensSelected = [];
    var arrSharingItensOld = [];

    init();
    function init() {
      if(LoginLogoutSrv.verifyAuth()){
        self.userDetails = $rootScope.authDetails.user;
        self.codUsuLogged = self.userDetails.id;

        var codUsuAddSharing = $localStorage.codUserAddSharing;
        
        if (!StringUtils.isEmpty(codUsuAddSharing)) {
          self.codUsuDestiny = codUsuAddSharing;
          self.sharingWithMe = 'C';
          findSharing();
        }
  
        $timeout(function () {
          self.gridOptions.api.setRowData(undefined);
        }, 500);

        $timeout(function () {
          self.gridOptionsItens.api.setRowData(undefined);
        }, 500);
      }
    }

    self.sharingItem = [
      {
        id: 1
      ,idSharing: 1
      ,bookName: 'Mafalda'
      ,devolutionDate: '03/12/2018'
      ,observation: ''
      ,statusSharing: 'P'
      ,sharingType: 'C'
      ,sharingItem: 0
      },
      {
        id:2
      ,idSharing: 2
      ,bookName: 'Matilda'
      ,devolutionDate: '05/01/2019'
      ,observation: ''
      ,statusSharing: 'P'
      ,sharingType: 'C'
      ,sharingItem: 0
      },
      {
        id: 3
      ,idSharing: 3
      ,bookName: 'A Nastacia'
      ,devolutionDate: '23/12/2018'
      ,observation: ''
      ,statusSharing: 'P'
      ,sharingType: 'C'
      ,sharingItem: 0
      },
      {
        id: 2
      ,idSharing: 1
      ,bookName: 'Sitio do Picapau Amarelo'
      ,devolutionDate: '22/12/2018'
      ,observation: ''
      ,statusSharing: 'P'
      ,sharingType: 'C'
      ,sharingItem: 0
      }
    ];

    self.sharing = [
      {
        id: 1,
        userDestiny: 1,
        nameUserDestiny: 'Josiemerson',
        userOrigin: 2,
        nameUserOrigin: 'Gabriela',
        sharingDateAndHour: '18/10/2018',
        sharingValue: 'R$ ' + 200
      },
      { 
        id: 2,
        userDestiny: 3,
        nameUserDestiny: 'Renan',
        userOrigin: 2,
        nameUserOrigin: 'Gabriela',
        sharingDateAndHour: '22/10/2018',
        sharingValue: 'R$ ' + 0
      },
      {
        id: 3,
        userDestiny: 4,
        nameUserDestiny: 'Renata',
        userOrigin: 2,
        nameUserOrigin: 'Gabriela',
        sharingDateAndHour: '23/09/2018',
        sharingValue: 'R$ ' + 0
      }
    ];

    function getColumnDefs(tipo) {
      if (tipo == 'sharing') {
        return [
          { headerName: "Compartilhamento", field: "id", width: 150, cellStyle: { 'text-align': 'right' } },
          { headerName: "Cód. Emprestador", field: "userOrigin.profile.codUsu", width: 150, cellStyle: { 'text-align': 'right' } },
          { headerName: "Emprestador", field: "userOrigin.profile.name" },
          { headerName: "Cód. Solicitante", field: "userDestiny.profile.codUsu", width: 150, cellStyle: { 'text-align': 'right' } },
          { headerName: "Solicitante", field: "userDestiny.profile.name" },
          {
            // headerName: "Data Compartilhamento", field: "sharingDateAndHour", valueGetter: function chainValueGetter(params) {
            //   return DateUtils.formatDate(params.data.sharingDateAndHour);
            // }
            headerName: "Data Compartilhamento", field: "sharingDateAndHour"
          },
          { headerName: "Valor Compartilhamento", field: "sharingValue" }
        ];
      }

      if (tipo == 'sharingItem') {
        return [
          { headerName: "Item", field: "id", width: 100, cellStyle: { 'text-align': 'right' } },
          { headerName: "Código Livro", field: "book.id", width: 100, cellStyle: { 'text-align': 'right' } },
          { headerName: "Titulo Livro", field: "book.name" },
          {
            headerName: "Data devolução", field: "devolutionDate", cellStyle: { 'text-align': 'right' }
            // ,valueGetter: function chainValueGetter(params) {
            //   return DateUtils.formatDate(params.data.schedulingDate);
            // }
          },
          { headerName: "Observação Emprestador", field: "observation" , width: 265},
          { headerName: "Status item", field: "statusSharingPresentation", width: 150 },
          // { headerName: "Cod. Status Item", field: "statusSharing", width: 0 },
          { headerName: "Tipo", field: "sharingType" },
          { headerName: "Vlr. Item", field: "sharingItemValue"}
        ];
      }
    }

    function findSharing() {
      RestSrv.blockRequest("Consultando compartilhamentos...");
      
      // self.gridOptions.api.setRowData(self.sharing);
      // buildSharingItem();
      var params = buildParams();

      //Apesar de estar como add é uma requisição de consulta
      RestSrv.add(URLS_SERVICES.SHARING_PORTAL_GET_SHARING, params, function(response){
        if (!StringUtils.isEmpty(response)){
          self.sharingEntity = [];
          self.sharingItens = [];

          ArrayUtils.forEach(response, function(item, index, arr){
            self.sharingEntity.push(item.sharingEntity);
            ArrayUtils.forEach(item.sharingItens, function(itemSharing, index, arr){
              self.sharingItens.push(itemSharing);
            });
          });

          self.gridOptions.api.setRowData(self.sharingEntity);


          buildSharingItem(self.sharingItens)
          self.gridOptionsItens.api.setRowData(null);
        } else {
          self.gridOptions.api.setRowData(null);
          self.gridOptionsItens.api.setRowData(null);
          MsgUtils.showAlert("Não foram encontrados compartilhamentos.")
        }

        RestSrv.unblockRequest();
      });

      //self.gridOptionsItens.api.setRowData(buildSharingItem(self.sharingItem));
    }

    function buildParams(){
      var params = {
        codUsu: undefined
        ,codUsuLogged : undefined
        ,dtCompIni : undefined
        ,dtCompFim : undefined
        ,dtDevIni : undefined
        ,dtDevFim : undefined
        ,statusBook : undefined
        ,sharingWithMe : undefined
      };

      if (!StringUtils.isEmpty(self.codUsuLogged)) {
        params.codUsuLogged = self.codUsuLogged;
      }
      if (!StringUtils.isEmpty(self.codUsuDestiny)) {
        params.codUsu = self.codUsuDestiny;
      }
      if (!StringUtils.isEmpty(self.dtDevolutionIni)) {
        params.dtDevIni = self.dtDevolutionIni;
      }
      if (!StringUtils.isEmpty(self.dtDevolutionFin)) {
        params.dtDevFim = self.dtDevolutionFin;
      }
      if (!StringUtils.isEmpty(self.dtCompIni)) {
        params.dtCompIni = self.dtCompIni;
      }
      if (!StringUtils.isEmpty(self.dtCompFim)) {
        params.dtCompFim = self.dtCompFim;
      }
      if (!StringUtils.isEmpty(self.statusBook)) {
        params.statusBook = self.statusBook;
      }
      if (!StringUtils.isEmpty(self.sharingWithMe)) {
        params.sharingWithMe = self.sharingWithMe;
      }

      return params;
    }
    function buildSharingItem(itens) {
      self.gridBuildOptionItem = [];
      ArrayUtils.forEach(itens, function(item, index, arr){
        var arrItemCopy = angular.copy(item);
        arrItemCopy.statusSharingPresentation = ConverterStatusSrv.converterSiglaToDescStatusItemSharing(arrItemCopy.statusSharing);
        arrItemCopy.sharingType = ConverterStatusSrv.converterSiglaToDescTypeItemSharing(arrItemCopy.sharingType);
        self.gridBuildOptionItem.push(arrItemCopy);
      });

      return self.gridBuildOptionItem;
    }

    function  onSelectionChanged() {
      // var selectedRows = gridOptions.api.getSelectedRows();
      // var selectedRowsString = '';
      // selectedRows.forEach( function(selectedRow, index) {
      //     if (index!==0) {
      //         selectedRowsString += ', ';
      //     }
      //     selectedRowsString += selectedRow.athlete;
      // });
    }
    function  onSelectionChangedItem() {
      // var selectedRows = gridOptions.api.getSelectedRows();
      // var selectedRowsString = '';
      // selectedRows.forEach( function(selectedRow, index) {
      //     if (index!==0) {
      //         selectedRowsString += ', ';
      //     }
      //     selectedRowsString += selectedRow.athlete;
      // });
    }

    function onRowSelected(event) {

      if (event ) {
        var firsSelection = (arrSharingItensSelected.length == 0 && arrSharingItensOld.length == 0);
        var otherSelection = (arrSharingItensSelected.length > 0 && arrSharingItensOld.length == 0);
        if (firsSelection || otherSelection){
          if (otherSelection) {
            arrSharingItensOld = arrSharingItensSelected;
            arrSharingItensSelected = [];
          }

          ArrayUtils.forEach(self.gridBuildOptionItem, function(item, index, arr){
            if (event.node.data.id == item.sharing) {
                arrSharingItensSelected.push(item);
            }
          });
  
          if (arrSharingItensSelected.length > 0) {
            self.gridOptionsItens.api.setRowData(arrSharingItensSelected);
          } else if (arrSharingItensOld.length > 0 ){
            arrSharingItensSelected 
          }
        } else {
  
          arrSharingItensOld = [];
        }

      }




      // window.alert("row " + event.node.data.athlete + " selected = " + event.node.selected);
  }

  function onRowSelectedItem(event) {
    // window.alert("row " + event.node.data.athlete + " selected = " + event.node.selected);
}
  });
