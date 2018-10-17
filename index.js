const app = angular.module('Life', []);

app.controller('LifeCtrl', ['$scope', function($scope) {
  $scope.test = 'Hello there';
  const size = 50;
  $scope.board = new Array(size);
  for (let i = 0; i < size; i++) {
    $scope.board[i] = new Array(size).fill(false);
  }
}]);
