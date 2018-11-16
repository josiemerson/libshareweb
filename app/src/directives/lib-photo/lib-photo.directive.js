// angular.module('libshareApp')
// .directive('libImg', function(){
//     return {
//         restrict: 'E',
//         // require: 'ngModel',
//         scope : {
//             file: '=LibModel',
//             onChange: '&LibChange'
//         },
//         controller: 'LibImgController'
//     }
// }).controller('libImgController', ['$rootScope', 'scope','$scope', function($rootScope, scope, $scope){
//     var self = this;

//     $scope.onChange = function (e, fileList) {
//         alert('this is on-change handler!');
//     };

//     $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
//         alert('this is handler for file reader onload event!');
//     };

//     var uploadedCount = 0;

//     $scope.files = [];
// }]);