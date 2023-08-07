const ESelectModeScreen = document.querySelector('.select-mode-screen');
const ESelectPvp = document.querySelector('.select-mode-pvp');
const ESelectPvc = document.querySelector('.select-mode-pvc');

const EGameScreen = document.querySelector('.game-screen');
const EScorecardOneName = document.querySelector('.scorecard:nth-child(1) .scorecard-name');
const EScorecardTwoName = document.querySelector('.scorecard:nth-child(2) .scorecard-name');
const EScorecardSOnecore = document.querySelector('.scorecard:nth-child(1) .scorecard-score');
const EScorecardTwoScore = document.querySelector('.scorecard:nth-child(2) .scorecard-score');
const EGameBoard = document.querySelector('.game-board');
const EBoardCells = document.querySelectorAll('.board-cell');
const ERoundResult = document.querySelector('.round-result-actual');

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
  roundWinner: '',
};

function isWinCond(winCond) {
  return (
    gameState.board[winCond[0]] !== '' &&
    gameState.board[winCond[0]] === gameState.board[winCond[1]] &&
    gameState.board[winCond[1]] === gameState.board[winCond[2]]
  );
}

function getTurnResult() {
  const winConds = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const winCondFinal = winConds.find(isWinCond);

  if (winCondFinal !== undefined) {
    return winCondFinal;
  }

  return null;
}

ESelectPvc.addEventListener('click', () => {
  ESelectModeScreen.classList.add('hidden');
  gameState.mode = 'pvc';
  gameState.playerOne.name = 'Player';
  gameState.playerTwo.name = 'Computer';
  EScorecardOneName.textContent = gameState.playerOne.name;
  EScorecardTwoName.textContent = gameState.playerTwo.name;
  EGameScreen.classList.remove('hidden');
  // ERoundResult.style.top = `${ERoundResult.offsetHeight}px`;
  // ERoundResult.style.top = `0px`;
});

ESelectPvp.addEventListener('click', () => {
  ESelectModeScreen.classList.add('hidden');
  gameState.mode = 'pvp';
  EGameScreen.classList.remove('hidden');
});

// TODO - a lot of shared code in the if blocks, take them out
EBoardCells.forEach(cell =>
  cell.addEventListener('click', () => {
    const cellNumber = cell.getAttribute('data-number');
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

    if (gameState.turnsPlayed >= 5) {
      const winCond = getTurnResult();
      if (winCond !== null) {
        if (gameState.board[winCond[0]] === 'X') {
          gameState.playerOne.score += 1;
          gameState.roundWinner = gameState.playerOne.name;
        } else {
          gameState.playerTwo.score += 1;
          gameState.roundWinner = gameState.playerTwo.name;
        }
      }

      EBoardCells[winCond[0]].classList.add('win-cell');
      EBoardCells[winCond[1]].classList.add('win-cell');
      EBoardCells[winCond[2]].classList.add('win-cell');

      ERoundResult.textContent = `${gameState.roundWinner} won the round`;
      ERoundResult.classList.add('show');
      setTimeout(() => {
        ERoundResult.classList.add('hide');
      }, 2500);
    }
  })
);

// TODO - reset data after round ends.
