import { useState, useEffect, useCallback } from 'react';

import { 
  randomTetromino, 
  checkCollision,
  rotate,
  clearRows,
  calculateScore,
  calculateLevel,
  calculateDropTime,
  createGameState,
  createBoard
} from './tetrisGameEngine';

// Import sound hook but don't use it yet - will be used by MainContainer

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
    
    return true; // Rotation successful - for sound effect trigger
  }, [gameState.board, gameState.player]);

  // Move the player left or right
  const movePlayer = useCallback((dir) => {
    if (!checkCollision(gameState.player, gameState.board, { x: dir, y: 0 })) {
      updatePlayerPosition(dir, 0, false);
      return true; // Movement successful - for sound effect trigger
    }
    return false; // Movement failed - no sound
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
      // Check for top of board collision - only if we're past the initial drop
      if (gameState.player.pos.y < 1) {
        // Give the player a chance to move the piece before declaring game over
        // We only mark game over if the piece has already collided
        if (gameState.player.collided) {
          setGameState(prev => ({
            ...prev,
            gameOver: true
          }));
          setDropTime(null);
          setGameStarted(false);
          return;
        }
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
        
        // Store if level increased for sound effects
        const levelUp = newLevel > prev.level;
        
        // Create new tetromino from next piece
        const nextPiece = prev.nextPiece;
        const pieceWidth = nextPiece.shape[0].length;
        const centerPos = Math.floor((10 - pieceWidth) / 2);
        
        const newPlayer = {
          pos: { x: centerPos, y: 0 },
          tetromino: nextPiece,
          collided: false,
        };
        
        // Check if the new piece immediately collides - if so, it's game over
        // But only if it collides with existing pieces, not just the board boundary
        const gameIsOver = (() => {
          // First check if part of the piece would be outside the top boundary
          let collisionWithFilledCell = false;
          
          for (let y = 0; y < newPlayer.tetromino.shape.length; y++) {
            for (let x = 0; x < newPlayer.tetromino.shape[y].length; x++) {
              // If this is part of the piece
              if (newPlayer.tetromino.shape[y][x] !== 0) {
                const boardY = y + newPlayer.pos.y;
                const boardX = x + newPlayer.pos.x;
                
                // If this would be inside the board
                if (boardY >= 0 && boardY < clearedBoard.length && 
                    boardX >= 0 && boardX < clearedBoard[0].length) {
                  // If there's already a piece there, it's game over
                  if (clearedBoard[boardY][boardX] !== 0) {
                    collisionWithFilledCell = true;
                  }
                }
              }
            }
          }
          
          return collisionWithFilledCell;
        })();
        
        return {
          ...prev,
          board: clearedBoard,
          player: newPlayer,
          nextPiece: randomTetromino(),
          score: newScore,
          rows: newRows,
          level: newLevel,
          gameOver: gameIsOver,
          lineClear: linesCleared > 0,
          levelUp: newLevel > prev.level
        };
      });
    }
  }, [gameState, updatePlayerPosition, updateBoard]);

  // Drop the tetromino one row down (soft drop)
  const dropPlayer = useCallback(() => {
    // Create a temporary faster drop time for soft drop
    const fastDropTime = calculateDropTime(gameState.level) / 10;
    setDropTime(fastDropTime);
    
    // Call drop once immediately
    drop();
    
    // Reset the drop time after a short delay
    setTimeout(() => {
      if (!gameOver && !paused) {
        setDropTime(calculateDropTime(gameState.level));
      }
    }, 100);
  }, [drop, gameState.level, gameOver, paused]);

  // These drop functions are handled elsewhere, so we can remove these unused functions

  // Handle key presses for game controls
  const handleKeyPress = useCallback((event) => {
    if (gameOver || paused || !gameStarted) return;

    // Track the action type for sound effects
    let actionType = null;

    switch(event.key) {
      case 'ArrowLeft':
        if (movePlayer(-1)) {
          actionType = 'move';
        }
        break;
      case 'ArrowRight':
        if (movePlayer(1)) {
          actionType = 'move';
        }
        break;
      case 'ArrowDown':
        dropPlayer();
        actionType = 'drop';
        break;
      case 'ArrowUp':
        if (rotatePlayer(1)) {
          actionType = 'rotate';
        }
        break;
      case ' ':
        // Hard drop - quickly drop to the bottom
        let dropDistance = 0;
        // Find how far down we can drop
        while (!checkCollision(gameState.player, gameState.board, { x: 0, y: dropDistance + 1 })) {
          dropDistance++;
        }
        
        if (dropDistance > 0) {
          // Move the piece down that many spaces
          updatePlayerPosition(0, dropDistance, false);
          actionType = 'hardDrop';
        }
        
        // Mark as collided to trigger the next piece
        updatePlayerPosition(0, 0, true);
        break;
      case 'p':
      case 'P':
        togglePause();
        break;
      default:
        break;
    }

    // Store the action type in state for components that need it (like for sound effects)
    if (actionType) {
      setGameState(prev => ({
        ...prev,
        lastAction: actionType
      }));
    }
  }, [gameOver, paused, gameStarted, movePlayer, dropPlayer, rotatePlayer, gameState.player, gameState.board, updatePlayerPosition, togglePause]);

  // Start new game
  const startGame = useCallback(() => {
    // Create a completely clean board
    const cleanBoard = createBoard();
    
    // Get a random tetromino for the first piece
    const firstPiece = randomTetromino();
    
    // Calculate proper initial position based on piece width for proper centering
    const pieceWidth = firstPiece.shape[0].length;
    const centerPos = Math.floor((10 - pieceWidth) / 2);
    
    // Create initial state with proper positioning
    const initialState = {
      board: cleanBoard,
      player: {
        pos: { x: centerPos, y: 0 },
        tetromino: firstPiece,
        collided: false,
      },
      nextPiece: randomTetromino(),
      score: 0,
      rows: 0,
      level: 0,
      gameOver: false,
      paused: false
    };
    
    // Ensure we're not already in a collision state
    if (checkCollision(initialState.player, initialState.board, { x: 0, y: 0 })) {
      // If initial position collides, try to move up a bit
      initialState.player.pos.y = -1;
    }
    
    setGameState({
      ...initialState,
      gameStart: true // Flag for game start sound effect
    });
    // Set up the drop interval
    setDropTime(calculateDropTime(0));
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
    
    // Clear any existing interval first to prevent duplicates
    if (dropInterval) {
      clearInterval(dropInterval);
    }
    
    if (dropTime && !paused && !gameOver && gameStarted) {
      // Immediately perform one drop to get the game moving
      if (gameState.player && gameState.board) {
        // Only drop if not already in collision state
        if (!checkCollision(gameState.player, gameState.board, { x: 0, y: 1 })) {
          drop();
        }
      }
      
      // Then set up the interval for subsequent drops
      dropInterval = setInterval(() => {
        drop();
      }, dropTime);
    }
    
    return () => {
      if (dropInterval) {
        clearInterval(dropInterval);
      }
    };
  }, [drop, dropTime, paused, gameOver, gameStarted, gameState.player, gameState.board]);

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
