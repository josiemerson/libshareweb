'use strict';

angular.module('libshareApp')
  .controller('SharingPortalCtrl', 
  function($scope, RestSrv, URLS_SERVICES, DateUtils,$rootScope, $timeout, LoginLogoutSrv) {
    var self = this;

    self.gridOptions = {
      columnDefs: getColumnDefs('sharing'),
      rowData: null
    };

    self.gridOptionsItens = {
      columnDefs: getColumnDefs('sharingItem'),
      rowData: null
    };

    self.statusFriendsOptions = [
      {key: 'A', value: 'Aprovado'}
      ,{key: 'N', value: 'Negado'}
      ,{key: 'P', value: 'Pendente'}
    ];

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

    self.sharing = [
      {sharing: 1,
        userDestiny: 'Josiemerson',
        sharingDateAndHour: '18/10/2018',
        sharingValue: 'R$ ' + 200
      },
      {sharing: 2,
        userDestiny: 'Renan',
        sharingDateAndHour: '22/10/2018',
        sharingValue: 'R$ ' + 0
      },
      {sharing: 1,
        userDestiny: 'Renata',
        sharingDateAndHour: '23/09/2018',
        sharingValue: 'R$ ' + 0
      }
    ];

    function getColumnDefs(tipo) {
      if (tipo == 'sharing') {
        return [
          { headerName: "Código", field: "sharing", width: 100, cellStyle: { 'text-align': 'right' } },
          { headerName: "Solicitante", field: "userDestiny" },
          {
            headerName: "Data Compartilhamento", field: "sharingDateAndHour", valueGetter: function chainValueGetter(params) {
              return DateUtils.formatDate(params.data.sharingDateAndHour);
            }
          },
          { headerName: "Valor Compartilhamento", field: "sharingValue" }
        ];
      }

      if (tipo == 'sharingItem') {
        return [
          { headerName: "Código Livro", field: "id", width: 100, cellStyle: { 'text-align': 'right' } },
          { headerName: "Titulo Livro", field: "book.name" },
          {
            headerName: "Data devolução", field: "devolutionDate", cellStyle: { 'text-align': 'right' },
            valueGetter: function chainValueGetter(params) {
              return DateUtils.formatDate(params.data.schedulingDate);
            }
          },
          { headerName: "Observação", field: "observation" , width: 265},
          { headerName: "Compartilhamento", field: "statusSharing", width: 150 }
        ];
      }
    }
  });
