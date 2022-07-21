const PLAYER1 = 'x'
const PLAYER2 = 'o'

// An array containing all winning combinations
export const WIN_CONDITIONS = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [7, 5, 3],
].map(set => set.map(cell => 'c' + cell))

// Takes the board state and the current player to see if they have won
function checkWin(board, player) {
  const plays = Object.entries(board).filter(c => c[1] === player).map(c => c[0])

  let gameWon = null;
  for (let [index, win] of WIN_CONDITIONS.entries()) {
    //debugger
    if (win.every(w => plays.indexOf(w) > -1)) {
      gameWon = { index, player };
      break;
    }
  }
  return gameWon;
}

// minimax - https://en.wikipedia.org/wiki/Minimax
//
// Takes the board state and the current player and determines the best possbile move in order to win.
export function minimax(board, freeCells, player) {
  const otherPlayer = player === PLAYER1 ? PLAYER2 : PLAYER1


  // Check for a terminal game condition (win/loss/draw)
  if (checkWin(board, PLAYER1)) { return { score: -10 } }
  if (checkWin(board, PLAYER2)) { return { score: 10 } }
  if (freeCells.length === 0) { return { score: 0 } }

  // Iterate recursively over all potentional moves to find the scores for every potentional move set
  let moves = [];
  for (var i = 0; i < freeCells.length; i++) {
    const cell = freeCells[i]
    board[freeCells[i]] = player;
    var { score } = minimax(board, freeCells.filter(fc => fc !== freeCells[i]), otherPlayer);
    board[freeCells[i]] = cell;
    moves.push({cell, score});
  }

  // Now we pick the best possible move avaiable and return it
  let bestMove;
  let bestScore = player === PLAYER2 ? -10000 : 10000
  for (var i = 0; i < moves.length; i++) {
    const isBestScore = player === PLAYER2 ? moves[i].score > bestScore : moves[i].score < bestScore
    if (isBestScore) {
      bestScore = moves[i].score;
      bestMove = i;
    }
  }

  return moves[bestMove];
}
