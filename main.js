const ESelectModeScreen = document.querySelector('.select-mode-screen');
const ESelectPvp = document.querySelector('.select-mode-pvp');
const ESelectPvc = document.querySelector('.select-mode-pvc');

const EGameScreen = document.querySelector('.game-screen');
const EScorecardOneName = document.querySelector('.scorecard:nth-child(1) .scorecard-name');
const EScorecardTwoName = document.querySelector('.scorecard:nth-child(2) .scorecard-name');
const EScorecardOneScore = document.querySelector('.scorecard:nth-child(1) .scorecard-score');
const EScorecardTwoScore = document.querySelector('.scorecard:nth-child(2) .scorecard-score');
const EBoardCells = document.querySelectorAll('.board-cell');
const EGameResult = document.querySelector('.game-result');
const EGameButtonReplay = document.querySelector('.game-result-replay');
const EGameButtonRestart = document.querySelector('.game-result-restart');

const WIN_SCORE = 2;

const gameState = {
  mode: '',
  playerOne: {
    name: '',
    score: 0,
  },
  playerTwo: {
    name: '',
    score: 0,
  },
  board: ['', '', '', '', '', '', '', '', ''],
  turn: 'playerOne',
  turnsPlayed: 0,
  gameWinner: '',
};

function isWinCoord(winCoord) {
  return (
    gameState.board[winCoord[0]] !== '' &&
    gameState.board[winCoord[0]] === gameState.board[winCoord[1]] &&
    gameState.board[winCoord[1]] === gameState.board[winCoord[2]]
  );
}

function getTurnResult() {
  const winCoords = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const winCoordFinal = winCoords.find(isWinCoord);

  if (winCoordFinal !== undefined) {
    return winCoordFinal;
  }

  return null;
}

function playCell(cell, cellNumber) {
  if (gameState.board[cellNumber] === '') {
    if (gameState.turn === 'playerOne') {
      gameState.board[cellNumber] = 'X';
      gameState.turn = 'playerTwo';
      cell.textContent = 'X';
    } else if (gameState.turn === 'playerTwo') {
      gameState.board[cellNumber] = 'O';
      gameState.turn = 'playerOne';
      cell.textContent = 'O';
    }
  }

  gameState.turnsPlayed += 1;
  cell.classList.remove('empty');
  cell.disabled = true;
}

ESelectPvc.addEventListener('click', () => {
  ESelectModeScreen.classList.add('hidden');
  gameState.mode = 'pvc';
  gameState.playerOne.name = 'Player';
  gameState.playerTwo.name = 'Computer';
  EScorecardOneName.textContent = gameState.playerOne.name;
  EScorecardTwoName.textContent = gameState.playerTwo.name;
  EGameScreen.classList.remove('hidden');
  document.documentElement.style.setProperty(
    '--game-result-height',
    `${EGameResult.offsetHeight}px`
  );
});

ESelectPvp.addEventListener('click', () => {
  ESelectModeScreen.classList.add('hidden');
  gameState.mode = 'pvp';
  EGameScreen.classList.remove('hidden');
  gameState.playerOne.name = 'Player One';
  gameState.playerTwo.name = 'Player Two';
  EScorecardOneName.textContent = gameState.playerOne.name;
  EScorecardTwoName.textContent = gameState.playerTwo.name;
  document.documentElement.style.setProperty(
    '--game-result-height',
    `${EGameResult.offsetHeight}px`
  );
});

// TODO - a lot of shared code in the if blocks, take them out
EBoardCells.forEach(cell =>
  cell.addEventListener('click', () => {
    const cellNumber = cell.getAttribute('data-number');
    playCell(cell, cellNumber);

    const winCoord = getTurnResult();

    if (gameState.turnsPlayed >= 5) {
      if (winCoord !== null) {
        if (gameState.board[winCoord[0]] === 'X') {
          gameState.playerOne.score += 1;
          EScorecardOneScore.textContent = gameState.playerOne.score;
          gameState.gameWinner = gameState.playerOne.name;
        } else {
          gameState.playerTwo.score += 1;
          EScorecardTwoScore.textContent = gameState.playerTwo.score;
          gameState.gameWinner = gameState.playerTwo.name;
        }

        EBoardCells.forEach(cell => {
          cell.disabled = true;
        });

        EBoardCells[winCoord[0]].classList.add('win-cell');
        EBoardCells[winCoord[1]].classList.add('win-cell');
        EBoardCells[winCoord[2]].classList.add('win-cell');

        if (gameState.playerOne.score < WIN_SCORE && gameState.playerTwo.score < WIN_SCORE) {
          setTimeout(() => {
            resetRound();
          }, 1500);
        } else {
          EGameResult.children[0].textContent = `${gameState.gameWinner} won the game`;
          EGameResult.classList.add('game-result-show');
          // setTimeout(() => {
          //   EGameResult.classList.add('game-result-hide');
          //   EGameResult.classList.remove('game-result-show');
          //   roundEnd();
          // }, 2000);
          // setTimeout(() => {
          //   EGameResult.classList.remove('game-result-hide');
          // }, 2500);
        }
      } else if (winCoord === null && gameState.board.find(cell => cell === '') === undefined) {
        setTimeout(() => {
          resetRound();
        }, 1500);
      }
    }
    const x = [];
    for (let i = 0; i < gameState.board.length; i++) {
      const y = gameState.board[i];
      if (y === '') {
        x.push(i);
      }
    }
    if (gameState.mode === 'pvc' && winCoord === null && x.length !== 0) {
      playComputerRound();

      if (gameState.turnsPlayed >= 5) {
        const winCoord = getTurnResult();
        if (winCoord !== null) {
          if (gameState.board[winCoord[0]] === 'X') {
            gameState.playerOne.score += 1;
            EScorecardOneScore.textContent = gameState.playerOne.score;
            gameState.gameWinner = gameState.playerOne.name;
          } else {
            gameState.playerTwo.score += 1;
            EScorecardTwoScore.textContent = gameState.playerTwo.score;
            gameState.gameWinner = gameState.playerTwo.name;
          }

          EBoardCells.forEach(cell => {
            cell.disabled = true;
          });

          EBoardCells[winCoord[0]].classList.add('win-cell');
          EBoardCells[winCoord[1]].classList.add('win-cell');
          EBoardCells[winCoord[2]].classList.add('win-cell');

          if (gameState.playerOne.score < WIN_SCORE && gameState.playerTwo.score < WIN_SCORE) {
            setTimeout(() => {
              resetRound();
            }, 1500);
          } else {
            EGameResult.children[0].textContent = `${gameState.gameWinner} won the game`;
            EGameResult.classList.add('game-result-show');
            // setTimeout(() => {
            //   EGameResult.classList.add('game-result-hide');
            //   EGameResult.classList.remove('game-result-show');
            //   roundEnd();
            // }, 2000);
            // setTimeout(() => {
            //   EGameResult.classList.remove('game-result-hide');
            // }, 2500);
          }
        } else if (winCoord === null && gameState.board.find(cell => cell === '') === undefined) {
          setTimeout(() => {
            resetRound();
          }, 1500);
        }
      }
    }
  })
);

EGameButtonReplay.addEventListener('click', () => {
  resetReplay();
  EGameResult.classList.remove('game-result-show');
  EGameResult.classList.add('game-result-hide');
  setTimeout(() => {
    EGameResult.classList.remove('game-result-hide');
  }, 500);
});

EGameButtonRestart.addEventListener('click', () => {
  resetGame();
  EGameResult.classList.remove('game-result-show');
  EGameResult.classList.remove('game-result-hide');
  EGameScreen.classList.add('hidden');
  ESelectModeScreen.classList.remove('hidden');
});

// TODO - tie

function resetRound() {
  gameState.board = ['', '', '', '', '', '', '', '', ''];
  gameState.turn = 'playerOne';
  gameState.turnsPlayed = 0;
  gameState.gameWinner = '';

  EBoardCells.forEach(cell => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.add('empty');
    cell.classList.remove('win-cell');
  });
}

function resetReplay() {
  gameState.board = ['', '', '', '', '', '', '', '', ''];
  gameState.turn = 'playerOne';
  gameState.turnsPlayed = 0;
  gameState.gameWinner = '';

  EBoardCells.forEach(cell => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.add('empty');
    cell.classList.remove('win-cell');
  });

  gameState.playerOne.score = 0;
  gameState.playerTwo.score = 0;
  EScorecardOneScore.textContent = '0';
  EScorecardTwoScore.textContent = '0';
}

function resetGame() {
  gameState.mode = '';
  gameState.playerOne.name = '';
  gameState.playerOne.score = 0;
  gameState.playerTwo.name = '';
  gameState.playerTwo.score = 0;
  gameState.board = ['', '', '', '', '', '', '', '', ''];
  gameState.turn = 'playerOne';
  gameState.turnsPlayed = 0;
  gameState.gameWinner = '';

  EBoardCells.forEach(cell => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.add('empty');
    cell.classList.remove('win-cell');
  });

  EScorecardOneName.textContent = '';
  EScorecardOneScore.textContent = '0';
  EScorecardTwoName.textContent = '';
  EScorecardTwoScore.textContent = '0';
}

function playComputerRound() {
  const emptyCells = [];
  for (let i = 0; i < gameState.board.length; i++) {
    const cell = gameState.board[i];
    if (cell === '') {
      emptyCells.push(i);
    }
  }

  const chosenCell = Math.floor(Math.random() * emptyCells.length);
  playCell(EBoardCells[emptyCells[chosenCell]], emptyCells[chosenCell]);
}

// TODO - computer RNG play
