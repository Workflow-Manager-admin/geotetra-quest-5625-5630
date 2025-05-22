import { useState, useEffect, useCallback } from 'react';

import { 
  createBoard, 
  randomTetromino, 
  checkCollision,
  rotate,
  clearRows,
  calculateScore,
  calculateLevel,
  calculateDropTime,
  createGameState,
  updateBoard as updateGameBoard
} from './tetrisGameEngine';

export const useGameState = () => {
  const [gameState, setGameState] = useState(createGameState());
  const [dropTime, setDropTime] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Extract game state properties for easier access
  const { board, player, nextPiece, score, rows, level, gameOver, paused } = gameState;

  // Update player position
  const updatePlayerPosition = useCallback((x, y, collided) => {
    setGameState(prev => ({
      ...prev,
      player: {
        ...prev.player,
        pos: {
          x: (prev.player.pos.x + x),
          y: (prev.player.pos.y + y)
        },
        collided
      }
    }));
  }, []);

  // Update board when player tetromino collides
  const updateBoard = useCallback((prevBoard, player) => {
    const newBoard = [...prevBoard].map(row => [...row]);
    
    player.tetromino.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          if (
            y + player.pos.y >= 0 && 
            y + player.pos.y < prevBoard.length && 
            x + player.pos.x >= 0 && 
            x + player.pos.x < prevBoard[0].length
          ) {
            newBoard[y + player.pos.y][x + player.pos.x] = parseInt(player.tetromino.color);
          }
        }
      });
    });
    
    return newBoard;
  }, []);

  // Define togglePause before it's used
  const togglePause = useCallback(() => {
    if (!gameOver && gameStarted) {
      setGameState(prev => {
        // Toggle paused state
        const newPaused = !prev.paused;
        
        // Set drop time based on paused state
        if (!newPaused) {
          // Resume game
          setDropTime(calculateDropTime(prev.level));
        } else {
          // Pause game
          setDropTime(null);
        }
        
        return {
          ...prev,
          paused: newPaused
        };
      });
    }
  }, [gameOver, gameStarted]);

  // Rotate the player's tetromino
  const rotatePlayer = useCallback((dir) => {
    // Make a deep copy of player
    const clonedPlayer = JSON.parse(JSON.stringify(gameState.player));
    
    // Rotate the tetromino
    clonedPlayer.tetromino.shape = rotate(clonedPlayer.tetromino.shape, dir);

    // Check for collisions after rotation and handle wall kicks
    const pos = clonedPlayer.pos.x;
    let offset = 1;
    
    // Try to adjust position if rotation causes collision
    while (checkCollision(clonedPlayer, gameState.board, { x: 0, y: 0 })) {
      // Try moving left and right to avoid collision
      clonedPlayer.pos.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1)); // Adjust offset for next try
      
      // If offset gets too large, rotation isn't possible - revert
      if (offset > clonedPlayer.tetromino.shape[0].length) {
        // Reset the position and shape (rotation failed)
        clonedPlayer.pos.x = pos;
        clonedPlayer.tetromino.shape = rotate(clonedPlayer.tetromino.shape, -dir);
        return;
      }
    }
    
    // Update the player state with rotated tetromino
    setGameState(prev => ({
      ...prev,
      player: clonedPlayer
    }));
  }, [gameState.board, gameState.player]);

  // Move the player left or right
  const movePlayer = useCallback((dir) => {
    if (!checkCollision(gameState.player, gameState.board, { x: dir, y: 0 })) {
      updatePlayerPosition(dir, 0, false);
    }
  }, [gameState.player, gameState.board, updatePlayerPosition]);

  // Drop the tetromino one row down
  const drop = useCallback(() => {
    // Increase level when player has cleared 10 rows
    const newLevel = gameState.rows > 0 && gameState.rows % 10 === 0
      ? gameState.level + 1
      : gameState.level;
    
    // Update drop time based on level
    if (newLevel > gameState.level) {
      setDropTime(calculateDropTime(newLevel));
    }
    
    // Check if we can move down
    if (!checkCollision(gameState.player, gameState.board, { x: 0, y: 1 })) {
      updatePlayerPosition(0, 1, false);
    } else {
      // Check for game over - if collision at top of board
      // Only trigger game over if there's a collision at the top row AND the piece has already been marked as collided
      if (gameState.player.pos.y < 2 && gameState.player.collided) {
        setGameState(prev => ({
          ...prev,
          gameOver: true
        }));
        setDropTime(null);
        setGameStarted(false);
        return;
      }
      
      // Handle tetromino landing
      setGameState(prev => {
        // Mark tetromino as collided
        const updatedPlayer = {
          ...prev.player,
          collided: true
        };
        
        // Update board with the collided tetromino
        const updatedBoard = updateBoard(prev.board, updatedPlayer);
        
        // Clear completed rows and calculate new score
        const { clearedBoard, linesCleared } = clearRows(updatedBoard);
        const newRows = prev.rows + linesCleared;
        const newScore = prev.score + calculateScore(linesCleared, prev.level);
        const newLevel = calculateLevel(newRows);
        
        // Create new tetromino from next piece
        const newPlayer = {
          pos: { x: 3, y: 0 },
          tetromino: prev.nextPiece,
          collided: false,
        };
        
        return {
          ...prev,
          board: clearedBoard,
          player: newPlayer,
          nextPiece: randomTetromino(),
          score: newScore,
          rows: newRows,
          level: newLevel
        };
      });
    }
  }, [gameState, updatePlayerPosition, updateBoard]);

  // Drop the tetromino to the bottom instantly
  const dropPlayer = useCallback(() => {
    setDropTime(null); // Stop automatic dropping
    drop();
  }, [drop]);

  // Start automatic dropping
  const startDropping = useCallback(() => {
    if (!paused && !gameOver) {
      setDropTime(calculateDropTime(level));
    }
  }, [paused, gameOver, level]);

  // Stop automatic dropping
  const stopDropping = useCallback(() => {
    setDropTime(null);
  }, []);

  // Handle key presses for game controls
  const handleKeyPress = useCallback((event) => {
    if (gameOver || paused || !gameStarted) return;

    switch(event.key) {
      case 'ArrowLeft':
        movePlayer(-1);
        break;
      case 'ArrowRight':
        movePlayer(1);
        break;
      case 'ArrowDown':
        dropPlayer();
        break;
      case 'ArrowUp':
        rotatePlayer(1);
        break;
      case ' ':
        // Hard drop - quickly drop to the bottom
        while (!checkCollision(gameState.player, gameState.board, { x: 0, y: 1 })) {
          updatePlayerPosition(0, 1, false);
        }
        updatePlayerPosition(0, 0, true); // Mark as collided after hard drop
        break;
      case 'p':
      case 'P':
        togglePause();
        break;
      default:
        break;
    }
  }, [gameOver, paused, gameStarted, movePlayer, dropPlayer, rotatePlayer, gameState.player, gameState.board, updatePlayerPosition, togglePause]);

  // Start new game
  const startGame = useCallback(() => {
    // Reset game state
    const initialState = createGameState();
    
    // Ensure the initial piece doesn't immediately collide
    const hasCollision = checkCollision(
      initialState.player, 
      initialState.board, 
      { x: 0, y: 0 }
    );
    
    // If there's an immediate collision, try a different piece
    if (hasCollision) {
      initialState.player.tetromino = randomTetromino();
    }
    
    setGameState(initialState);
    setDropTime(calculateDropTime(0)); // Use proper drop time calculation
    setGameStarted(true);
  }, []);

  // Reset game
  const resetGame = useCallback(() => {
    setGameState(createGameState());
    setDropTime(null);
    setGameStarted(false);
  }, []);

  // Effect for handling automatic tetromino drops
  useEffect(() => {
    let dropInterval = null;
    
    if (dropTime && !paused && !gameOver) {
      dropInterval = setInterval(() => {
        drop();
      }, dropTime);
    }
    
    return () => {
      clearInterval(dropInterval);
    };
  }, [drop, dropTime, paused, gameOver]);

  // Effect for handling keyboard events
  useEffect(() => {
    if (gameStarted) {
      document.addEventListener('keydown', handleKeyPress);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, handleKeyPress]);

  // Generate a stage with the active tetromino for rendering
  const stage = useCallback(() => {
    const newStage = [...board].map(row => [...row]);
    
    // Add the active tetromino to the stage
    if (player && player.tetromino) {
      player.tetromino.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            if (
              y + player.pos.y >= 0 && 
              y + player.pos.y < newStage.length && 
              x + player.pos.x >= 0 && 
              x + player.pos.x < newStage[0].length
            ) {
              // Use the color value for rendering
              newStage[y + player.pos.y][x + player.pos.x] = parseInt(player.tetromino.color);
            }
          }
        });
      });
    }
    
    return newStage;
  }, [board, player]);

  return {
    // Game state
    board: stage(),
    player,
    nextPiece: nextPiece ? nextPiece.shape : Array(4).fill(Array(4).fill(0)),
    score,
    rows,
    level,
    gameOver,
    paused,
    gameStarted,
    
    // Game actions
    startGame,
    togglePause,
    resetGame
  };
};
