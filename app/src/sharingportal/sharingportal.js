'use strict';

angular.module('libshareApp')
  .controller('SharingPortalCtrl', 
  function($scope, RestSrv, URLS_SERVICES, DateUtils,$rootScope, $timeout, LoginLogoutSrv, ConverterStatusSrv, ArrayUtils) {
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

    self.statusFriendsOptions = [
      {key: 'A', value: 'Aprovado'}
      ,{key: 'N', value: 'Negado'}
      ,{key: 'P', value: 'Pendente'}
    ];

    self.findSharing = findSharing;

    init();
    function init() {
      if(LoginLogoutSrv.verifyAuth()){
          // if ($routeParams.id) {
          //   findyPet(base64.decode($routeParams.id));
          // }
  
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
      },
      {
        id:1
      ,idSharing: 2
      ,bookName: 'Matilda'
      ,devolutionDate: '05/01/2019'
      ,observation: ''
      ,statusSharing: 'P'
      },
      {
        id: 2
      ,idSharing: 3
      ,bookName: 'A Nastacia'
      ,devolutionDate: '23/12/2018'
      ,observation: ''
      ,statusSharing: 'P'
      },
      {
        id: 3
      ,idSharing: 1
      ,bookName: 'Sitio do Picapau Amarelo'
      ,devolutionDate: '22/12/2018'
      ,observation: ''
      ,statusSharing: 'P'
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
          { headerName: "Cód. Emprestador", field: "userOrigin", width: 150, cellStyle: { 'text-align': 'right' } },
          { headerName: "Emprestador", field: "nameUserOrigin" },
          { headerName: "Cód. Solicitante", field: "userDestiny", width: 150, cellStyle: { 'text-align': 'right' } },
          { headerName: "Solicitante", field: "nameUserDestiny" },
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
          { headerName: "Código Livro", field: "idSharing", width: 100, cellStyle: { 'text-align': 'right' } },
          { headerName: "Titulo Livro", field: "bookName" },
          {
            headerName: "Data devolução", field: "devolutionDate", cellStyle: { 'text-align': 'right' }
            // ,valueGetter: function chainValueGetter(params) {
            //   return DateUtils.formatDate(params.data.schedulingDate);
            // }
          },
          { headerName: "Observação", field: "observation" , width: 265},
          { headerName: "Status item", field: "statusSharingPresentation", width: 150 },
          { headerName: "Cod. Status Item", field: "statusSharing", width: 0 }
        ];
      }
    }

    function findSharing() {
      self.gridOptions.api.setRowData(self.sharing);
      buildSharingItem();
      //self.gridOptionsItens.api.setRowData(buildSharingItem());
    }

    function buildSharingItem() {
      self.gridBuildOptionItem = [];
      ArrayUtils.forEach(self.sharingItem, function(item, index, arr){
        var arrItemCopy = angular.copy(item);
        arrItemCopy.statusSharingPresentation = ConverterStatusSrv.converterSiglaToDescStatusItemSharing(arrItemCopy.statusSharing)
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
      if (event){
        var sharingItem = ArrayUtils.find(self.gridBuildOptionItem, function(item, index, arr){
          if (event.node.data.id == item.idSharing) {
              return true;
          } else {
            return false;
          }
        });

        if (sharingItem) {
          var arrData = [sharingItem];
          self.gridOptionsItens.api.setRowData(arrData);
        }
      }



      // window.alert("row " + event.node.data.athlete + " selected = " + event.node.selected);
  }

  function onRowSelectedItem(event) {
    // window.alert("row " + event.node.data.athlete + " selected = " + event.node.selected);
}
  });
