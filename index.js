const app = angular.module('Life', []);

app.controller('LifeCtrl', ['$scope', function($scope) {
  let ctrl = this;
  ctrl.test = 'Hello there';
  const size = 50;
  ctrl.board = new Array(size);
  for (let i = 0; i < size; i++) {
    ctrl.board[i] = new Array();
    for (let k = 0; k < size; k++) {
      ctrl.board[i][k] = false;
    }
  }
  ctrl.board[0][0] = true;

  ctrl.handleClick = function(cell) {
    cell = !cell;
    $scope.$apply();
  }
}]);
