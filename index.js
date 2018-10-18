const app = angular.module('Life', []);

app.controller('LifeCtrl', ['$http', '$interval', function($http, $interval) {
  let ctrl = this;
  ctrl.test = 0;
  const size = 50;
  let auto = false;

  // ctrl.board = new Array(size);
  // for (let i = 0; i < size; i++) {
  //   ctrl.board[i] = new Array();
  //   for (let k = 0; k < size; k++) {
  //     ctrl.board[i][k] = false;
  //   }
  // }
  // ctrl.board[0][0] = true;
  // ctrl.board[1][0] = true;
  // ctrl.board[2][0] = true;

  ctrl.board = createBoard(false);

  ctrl.handleClick = function(row, col) {
    ctrl.board[row][col] = !ctrl.board[row][col];
  };

  function createBoard(val) {
    const ret = new Array(size);
    for (let i = 0; i < size; i++) {
      ret[i] = new Array(size).fill(val);
    }
    return ret;
  }

  ctrl.autoRun = function() {
    ctrl.pause();
    auto = $interval(() => ctrl.nextStep(), 200);
  };

  ctrl.pause = function() {
    $interval.cancel(auto);
  }

  ctrl.reset = function() {
    ctrl.pause();
    ctrl.board = createBoard(false);
  }

  ctrl.downloadBoard = function() {
    let board = JSON.stringify(ctrl.board);
    console.log(board);
  };

  ctrl.loadBoard = function() {
    $http.get('./boards/loop.json').then(res => {
      ctrl.board = res.data;
    });
  };

  ctrl.load = function() {
    ctrl.reset();
    $http.get('./boards/looper.rle').then(res => {
      const [rules, ...pattern] = res.data.split('\n').filter(a => a.indexOf('#') === -1);
      setBoard(pattern.map(decode).join(''));
    })
  }

  function setBoard(pattern) {
    let i = 0,
      k = 0;
    pattern.split('').forEach(char => {
      switch (char) {
        case 'b':
          k++;
          break;
        case '$':
          i++;
          k = 0;
          break;
        case 'o':
          ctrl.board[i][k++] = true;
          break;
        case '!':
          break;
      }
    })
  }

  function decode(str) {
    // use a string to store count to account for multi digit nums
    let count = '';
    let out = '';

    str.split('').forEach((char) => {
      // build the count string
      if (char.match(/\d/)) {
        count += char;
        return;
      }
      // handle single char runs
      count = count ? parseInt(count, 10) : 1;
      // using the count and the current char, build the output string
      for (let i = 0; i < count; i += 1) {
        out += char;
      }
      count = '';
    });

    return out;
  }

  ctrl.nextStep = function() {
    const temp = createBoard(true);
    console.log('stepping');
    ctrl.test++;
    // code here
    for (let i = 0; i < size; i++) {
      for (let k = 0; k < size; k++) {
        let liveNeighbors = 0;
        temp[i][k] = ctrl.board[i][k];

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
            // ctrl.board[i][k] = false;
            temp[i][k] = false;
        }

        if (!ctrl.board[i][k] && liveNeighbors == 3) {
          // ctrl.board[i][k] = true;
          temp[i][k] = true;
        }
      }
    }
    ctrl.board = temp;
  };

  let checkNeighbor = function(i, k) {
    if (i < 0 || k < 0 || i >= size || k >= size) {
      return false;
    }
    return true;
  }

}]);
