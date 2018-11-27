'use strict';

angular
.module('libshareApp')
.constant('URL_IMAGE', {
	'USERS': '../img/users/',
	'USERS_ID': '../img/users/ID_',
	'MENUS' : '../img/menuSearch/',
	'BOOKS' : '/books/'
})
.controller('MapBooksCtrl', ['$scope', 'RestSrv', 'Transporter', 'ArrayUtils', 'CategoriesSrv', 'StringUtils', 'ngNotify', 'URL_IMAGE', 
'$location', '$window', '$rootScope', '$localStorage','LoginLogoutSrv', 'MsgUtils',
function( $scope,RestSrv,Transporter, ArrayUtils, CategoriesSrv, StringUtils, ngNotify, URL_IMAGE, 
	$location, $window, $rootScope, $localStorage, LoginLogoutSrv, MsgUtils) {
		var self = this;
		// $window.localStorage.setItem('my-storage', val);

		self.initMap = initMap;
        self.refresh = refresh;
		self.tracarRota = tracarRota;
		self.map;

        var myPosition = null;
		var markers = [];
		var directionsDisplay = null;
		var CONSTANT_MAP = {
				'CEP': 'C',
				'ENDERECO': 'E'
			};

		function initMap() {
			if(LoginLogoutSrv.verifyAuth()){
				var map = new google.maps.Map(document.getElementById('map'), {
					zoom: 13
				});
	
				self.map = map;
	
				refreshMarkersInMap();
			}
		}

		function refresh(){
			markers = [];

			cleanRotesInMap();

			self.map.setZoom(14);

			removeMarkers();

			refreshMarkersInMap();			
		}

		function cleanRotesInMap(){
			if(typeof directionsDisplay != "undefined"){
				directionsDisplay.setDirections(null)
				directionsDisplay.setMap(null);
			}
		}

		function getImagem(idUser, pathFoto){
			var imageDefault = "user.png";
			var sourceImg = !StringUtils.isEmpty(pathFoto) ? URL_IMAGE.USERS_ID + idUser + '/' + pathFoto : URL_IMAGE.USERS + imageDefault;

			var image = {
				url: sourceImg, // url
				scaledSize: new google.maps.Size(50, 50), // scaled size
				origin: new google.maps.Point(0,0), // origin
				anchor: new google.maps.Point(0, 0) // anchor
			};
			return image;
		}

		function getPosition(profile){
			var position;
			if (!StringUtils.isEmpty(profile.latLong)){
				var latLong = profile.latLong.split(';');
				var latitude = latLong[0].split(':')[1];
				var longitude = latLong[1].split(':')[1];

				position = {lat : parseFloat(latitude), lng: parseFloat(longitude)}
			}

			return position;
		}

		function refreshMarkersInMap(){
			var map = self.map;
			self.userDetails = $rootScope.authDetails.user;

			if (true) {
				myPosition = {
					lat: -18.9220192,
					lng: -48.3150347
				};

				map.setCenter(myPosition);
			} else if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position) {
					myPosition = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};
					myPosition = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
					};

					Lat:-18.9220192;Long:-48.3150347

					map.setCenter(myPosition);

					var isUser = true;
					var image = getImagem(isUser);
					var my = {	location : myPosition };

					// markers[markers.length + 1] = addCommonMarker(my, map);		
				}, function() {
					handleLocationError(true);
				});
			} else {
				handleLocationError(false);
			}

			// var category = Transporter.getData('categories');
			var category = $rootScope.categoriesFind;
			if (category && category.genre) {
				self.clickedGenre = category.genre;

				var params = {genre: category.genre,
					userLogged: self.userDetails.id
				};

				CategoriesSrv.findProfileByCategoriesWithoutUserLogged	(params, function(dataResponse){

					if (StringUtils.isEmpty(dataResponse)) {

						// treatMarkes(dataResponse.data, map);

						var msg = 'Não foram encontrados usuários com livros disponíveis nesta categoria.';
						MsgUtils.showAlert(msg);
					} else {
						
						treatMarkes(dataResponse, map);
					}
				});
			}
		}

		function clickBookcase(profile) {
			// Transporter.setData('books', {profile: profile});
			$rootScope.userBooksFind = {'profile': profile};
			$localStorage.userBooksFind = {'profile': profile};

			$location.url("/bookcase").replace();
			//utilizado para informar ao scope que houve alterações que necessitam de um refresh
			$scope.$apply();
		}

		function treatMarkes(dataResponse, map) {
			var arrProfiles = dataResponse;
			if (arrProfiles) {
				ArrayUtils.forEach(arrProfiles, function(profile, index) {

					markers[markers.length + 1] = addMarker(map, getPosition(profile), profile);
				});
			}
		}

		function addMarker(map, position, profile){
			var infowindow = new google.maps.InfoWindow({
			});

			map.addListener('click', function(event) {
				infowindow.close();
			});

			var isUser = false;

			var dataMarker = {  
				id: profile.codUsu
				,profile : profile
				,name : profile.name
				,lastName: profile.lastName
				,location: position
				,image : getImagem(profile.codUsu, profile.pathFoto)
			};

			var marker = addCommonMarker(dataMarker, map);				

			marker.addListener('click', function(event) {
				clickBookcase(profile);
				// infowindow.setContent(contentString(profile));
				// infowindow.open(map, marker);
			});

			return  marker;
		}

		function contentString(profile){
			self.profile = profile;
			// self.pathImage = getImagem(profile.id, profile.pathFoto).url;
			// self.nameProfile = profile.name;
			var contentString = '<div id="contentMap">'+
			'<img class="circle" src="' + getImagem(profile.id, profile.pathFoto).url + '" alt="Smiley face" height="36x" width="36px"/>' +
			'<h4 id="headerPopupMap">'
				+ 'Nome: '+ profile.name +'</h4>'+
				'<div id="bodyContent">' + 
				'<input value="Estante" ng-click="clickBookcase()" class="btn btn-success form-control">'
				;

				contentString = contentString + '</div>'+'</div>';

			return contentString;
		}

		function addCommonMarker(dataMarker, map){
			var objectMarker = {
				  position: dataMarker.location,
				  map: map,
				  title: "Nome: " + dataMarker.name + ' ' + dataMarker.lastName
			};

			if (!StringUtils.isEmpty(dataMarker.image)) {
				objectMarker.icon = dataMarker.image;
			}

			var marker = new google.maps.Marker(objectMarker);

			return marker;
		}

		function removeMarkers(){
			setMapOnAll(null);
		}

		function setMapOnAll(map) {
			markers.forEach(function(marker, index){
				marker.setMap(map);
			});
		}

		function dadosRota(origin, map, marker){
			this.origin = origin;
			this.map = map;
			this.marker = marker;
		}

		function tracarRota(dadosRota){
			removeMarkers();

			directionsDisplay = new google.maps.DirectionsRenderer();
			var directionsService = new google.maps.DirectionsService;

			var request = {
				origin: dadosRota.origin,
				destination: dadosRota.marker.getPosition(),
				travelMode: google.maps.DirectionsTravelMode.DRIVING
			};

			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(response);
					directionsDisplay.setMap(dadosRota.map);
				}
			});
		}

		function handleLocationError(browserHasGeolocation) {
			window.alert(browserHasGeolocation ?
							  'Error: The Geolocation service failed.' :
							  'Error: Your browser doesn\'t support geolocation.');
        }

        google.maps.event.addDomListener(window, 'load',self.initMap());        
    }]);