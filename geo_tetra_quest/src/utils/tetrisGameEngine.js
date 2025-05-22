/**
 * Tetris Game Engine
 * Handles core tetris game mechanics including:
 * - Tetromino shapes and rotations
 * - Board state management
 * - Collision detection
 * - Line clearing and scoring
 */

// Define tetromino shapes using a standard representation
// Each tetromino is defined as a 4x4 matrix
export const TETROMINOS = {
  0: { shape: [[0]], color: '0' },
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: '1',
  },
  J: {
    shape: [
      [0, 0, 0],
      [2, 2, 2],
      [0, 0, 2]
    ],
    color: '2',
  },
  L: {
    shape: [
      [0, 0, 0],
      [3, 3, 3],
      [3, 0, 0]
    ],
    color: '3',
  },
  O: {
    shape: [
      [4, 4],
      [4, 4]
    ],
    color: '4',
  },
  S: {
    shape: [
      [0, 0, 0],
      [0, 5, 5],
      [5, 5, 0]
    ],
    color: '5',
  },
  T: {
    shape: [
      [0, 0, 0],
      [6, 6, 6],
      [0, 6, 0]
    ],
    color: '6',
  },
  Z: {
    shape: [
      [0, 0, 0],
      [7, 7, 0],
      [0, 7, 7]
    ],
    color: '7',
  }
};

// Return a random tetromino
export const randomTetromino = () => {
  const tetrominos = 'IJLOSTZ';
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return TETROMINOS[randTetromino];
};

// Create an empty board
export const createBoard = (height = 20, width = 10) => 
  Array.from(Array(height), () => Array(width).fill(0));

// Check if a position is valid (no collisions)
export const checkCollision = (player, board, { x: moveX, y: moveY }) => {
  // Loop through tetromino shape
  for (let y = 0; y < player.tetromino.shape.length; y++) {
    for (let x = 0; x < player.tetromino.shape[y].length; x++) {
      // Check if we're on an actual tetromino cell
      if (player.tetromino.shape[y][x] !== 0) {
        // Calculate the position on the board
        const newY = y + player.pos.y + moveY;
        const newX = x + player.pos.x + moveX;
        
        // Check boundaries first
        if (
          newY < 0 || 
          newY >= board.length || 
          newX < 0 || 
          newX >= board[0].length
        ) {
          return true; // Out of bounds - collision
        }
        
        // Check if the cell is already filled on the board
        if (board[newY][newX] !== 0) {
          return true; // Cell already occupied - collision
        }
      }
    }
  }
  return false;
};

// Rotate a tetromino matrix 90 degrees
export const rotate = (matrix, dir) => {
  // Make the rows columns (transpose)
  const rotatedTetromino = matrix.map((_, index) => 
    matrix.map(col => col[index])
  );
  
  // Reverse each row to get a rotated matrix
  // dir = 1 for clockwise, dir = -1 for counter-clockwise
  if (dir > 0) {
    return rotatedTetromino.map(row => row.reverse());
  }
  // For counter-clockwise, reverse the columns
  return rotatedTetromino.reverse();
};

// Clear completed rows and return the new board and number of cleared rows
export const clearRows = (board) => {
  let linesCleared = 0;
  const newBoard = board.reduce((acc, row) => {
    // If all cells in a row are filled (not 0), increment linesCleared
    if (row.every(cell => cell !== 0)) {
      linesCleared += 1;
      // Add an empty row at the top of the board
      acc.unshift(new Array(board[0].length).fill(0));
      return acc;
    }
    // Keep the row as is
    acc.push([...row]);
    return acc;
  }, []);
  
  return { clearedBoard: newBoard, linesCleared };
};

// Calculate score based on rows cleared and level
export const calculateScore = (rowsCleared, level) => {
  const points = [0, 40, 100, 300, 1200]; // Classic Tetris scoring
  return rowsCleared > 0 ? points[rowsCleared] * (level + 1) : 0;
};

// Calculate level based on rows cleared
export const calculateLevel = (rowsCleared) => {
  return Math.floor(rowsCleared / 10);
};

// Calculate drop time based on level (game speed increases with level)
export const calculateDropTime = (level) => {
  return 1000 / (level + 1) + 200;
};

// Create a game state object for initializing the game
export const createGameState = () => {
  return {
    board: createBoard(),
    player: {
      pos: { x: 3, y: 0 },
      tetromino: randomTetromino(),
      collided: false,
    },
    nextPiece: randomTetromino(),
    score: 0,
    rows: 0,
    level: 0,
    gameOver: false,
    paused: false
  };
};

// Update the game board by merging the player's tetromino with the board
export const updateBoard = (prevBoard, player) => {
  // Create a new board to avoid mutating the previous state
  const board = prevBoard.map(row => [...row]);

  player.tetromino.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        // Make sure we're not trying to place blocks outside the board boundaries
        if (
          y + player.pos.y >= 0 && 
          y + player.pos.y < board.length && 
          x + player.pos.x >= 0 && 
          x + player.pos.x < board[0].length
        ) {
          board[y + player.pos.y][x + player.pos.x] = parseInt(player.tetromino.color);
        }
      }
    });
  });

  return board;
};
