/*
 * Algorithm to find the next optimal move (for the computer)
 * in the Tic Tac Toe game
 */

const COMPUTER = 'o', OPPONENT = 'x', EMPTY = '_';

class Move {
  constructor() {
    this.row = -1;
    this.col = -1;
  }
}

// This function returns true if there are moves remaining on the board,
// false otherwise.
function has_moves_left(board) {
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 3; c++)
      if (board[r][c] === EMPTY) return true;

  return false;
}

// This is the evaluation function as discussed here http://goo.gl/sJgv68.
// Returns +/- 10 for winning/losing board or 0 otherwise.
function evaluate(board) {
  // Checking for Rows for X or O victory.
  for (let r = 0; r < 3; r++) {
    if (board[r][0] === board[r][1] && board[r][1] === board[r][2]) {
      if (board[r][0] === COMPUTER) return +10;
      if (board[r][0] === OPPONENT) return -10;
    }
  }
  // Checking for Columns for X or O victory.
  for (let c = 0; c < 3; c++) {
    if (board[0][c] === board[1][c] && board[1][c] === board[2][c]) {
      if (board[0][c] === COMPUTER) return +10;
      if (board[0][c] === OPPONENT) return -10;
    }
  }
  // Checking for diagonals for X or O victory.
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    if (board[0][0] === COMPUTER) return +10;
    if (board[0][0] === OPPONENT) return -10;
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    if (board[0][2] === COMPUTER) return +10;
    if (board[0][2] === OPPONENT) return -10;
  }

  // If none of them have won then return 0
  return 0;
}

// This function considers all the possible ways the game can go and returns
// the value of the board.
function minimax(board, depth, isMaximizer) {
  const score = evaluate(board);

  // If the game was won or lost, return the score
  if (score === 10 || score === -10) return score;

  // If there are no more moves and no winner then it is a tie
  if (!has_moves_left(board)) return 0;

  // If this is the Maximizer's move
  if (isMaximizer) {
    let best = -1000;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] === EMPTY) {
          // Cell is available, make the move
          board[r][c] = COMPUTER;

          // Call minimax recursively and choose the maximum value.
          best = Math.max(best, minimax(board, depth + 1, !isMaximizer));

          // Undo the move
          board[r][c] = EMPTY;
        }
      }
    }
    return best;
  }
  else { // Minimizer's move
    let best = 1000;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (board[r][c] === EMPTY) {
          // Cell is available, make the move
          board[r][c] = OPPONENT;

          // Call minimax recursively and record the minimum value
          best = Math.min(best, minimax(board, depth + 1, !isMaximizer));

          // Undo the move
          board[r][c] = EMPTY;
        }
      }
    }
    return best;
  }
}

// Returns best move, for the computer, 'o'.
function find_best_move(board) {
  let value, best_value = -100;
  let best_move = new Move();

  // Traverse and evaluate minimax function for all empty cells.
  // Return the cell with optimal value.
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[r][c] === EMPTY) {
        // Cell is available, make the move
        board[r][c] = COMPUTER;

        // Compute evaluation function for the above move.
        // Passing isMaxizer==false, i.e. best for computer.
        value = minimax(board, 0, false);

        // If this moves improve on the current best, then update best
        if (value > best_value) {
          best_move.row = r;
          best_move.col = c;
          best_value = value;
        }

        // Undo the move
        board[r][c] = EMPTY;
      }
    }
  }
  return best_move;
}

export default find_best_move;
