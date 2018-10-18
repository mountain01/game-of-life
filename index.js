/*global angular*/
const app = angular.module('Life', []);

app.controller('LifeCtrl', ['$http', '$interval', function($http, $interval) {
  let ctrl = this;
  ctrl.test = 0;
  const size = 70;
  let auto = false;
  ctrl.selectedPattern = '';
  ctrl.patterns = [
    { displayName: 'Star', value: './boards/star.json' },
    { displayName: 'Glider', value: './boards/glider.rle' },
    { displayName: 'Glider Gun', value: './boards/cosper-gun.rle' },
    { displayName: 'Pulsars', value: './boards/pulsars.json' },
  ];

  ctrl.board = createBoard(false);

  ctrl.handleClick = function(row, col) {
    ctrl.board[row][col] = !ctrl.board[row][col];
  };

  ctrl.patternSelected = function() {
    const value = ctrl.selectedPattern;
    ctrl.reset();
    if (value.indexOf('json') !== -1) {
      $http.get(value).then(res => ctrl.board = res.data);
    }
    else if (value.indexOf('rle') !== -1) {
      ctrl.load(value);
    }
  }

  function createBoard(val) {
    const ret = new Array(size);
    for (let i = 0; i < size; i++) {
      ret[i] = new Array(size).fill(val);
    }
    return ret;
  }

  ctrl.autoRun = function() {
    ctrl.pause();
    auto = $interval(() => ctrl.nextStep(), 100);
  };

  ctrl.pause = function() {
    $interval.cancel(auto);
  }

  ctrl.reset = function() {
    ctrl.pause();
    ctrl.test = 0;
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

  ctrl.load = function(value) {
    ctrl.reset();
    $http.get(value).then(res => {
      const [rules, ...pattern] = res.data.split('\n').filter(a => a.indexOf('#') === -1);
      setBoard(rules, pattern.map(decode).join(''));
    })
  }

  function setBoard(rules, pattern) {
    const center = size / 2;

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
      if (/\d/.test(char)) {
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
