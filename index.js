const app = angular.module('Life', []);

app.controller('LifeCtrl', ['$scope', function($scope) {
  let ctrl = this;
  ctrl.test = 0;
  const size = 50;
  let auto = false;

  ctrl.board = new Array(size);
  for (let i = 0; i < size; i++) {
    ctrl.board[i] = new Array();
    for (let k = 0; k < size; k++) {
      ctrl.board[i][k] = false;
    }
  }
  // ctrl.board[0][0] = true;
  // ctrl.board[1][0] = true;
  // ctrl.board[2][0] = true;

  ctrl.handleClick = function(cell) {
    cell = !cell;
    $scope.$apply();
  };

  ctrl.autoRun = function() {
    auto = setInterval(ctrl.nextStep, 1000);
  };

  ctrl.pause = function() {
    clearInterval(auto);
  }


  ctrl.nextStep = function() {
    console.log('stepping');
    ctrl.test++;
    // code here
    for (let i = 0; i < size; i++) {
      for (let k = 0; k < size; k++) {
        let liveNeighbors = 0;

        if (checkNeighbor(i - 1, k - 1) && ctrl.board[i - 1][k - 1] == true) {
          liveNeighbors++;
        }
        if (checkNeighbor(i, k - 1) && ctrl.board[i][k - 1] == true) {
          liveNeighbors++;
        }
        if (checkNeighbor(i + 1, k - 1) && ctrl.board[i + 1][k - 1] == true) {
          liveNeighbors++;
        }
        if (checkNeighbor(i + 1, k) && ctrl.board[i + 1][k] == true) {
          liveNeighbors++;
        }
        if (checkNeighbor(i + 1, k + 1) && ctrl.board[i + 1][k + 1] == true) {
          liveNeighbors++;
        }
        if (checkNeighbor(i, k + 1) && ctrl.board[i][k + 1] == true) {
          liveNeighbors++;
        }
        if (checkNeighbor(i - 1, k + 1) && ctrl.board[i - 1][k + 1] == true) {
          liveNeighbors++;
        }
        if (checkNeighbor(i - 1, k) && ctrl.board[i - 1][k] == true) {
          liveNeighbors++;
        }

        if (ctrl.board[i][k]) {
          if (liveNeighbors < 2 || liveNeighbors >= 4)
            ctrl.board[i][k] = false;
        }

        if (!ctrl.board[i][k] && liveNeighbors == 3) {
          ctrl.board[i][k] = true;
        }

      }
    }
  };

  let checkNeighbor = function(i, k) {
    if (i < 0 || k < 0 || i >= size || k >= size) {
      return false;
    }
    return true;
  }

}]);
