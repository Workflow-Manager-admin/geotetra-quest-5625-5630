import React, { useEffect } from 'react';
import './MainContainer.css';
import GameBoard from '../GameBoard/GameBoard';
import Block from '../Block/Block';
import { useGameState } from '../../utils/useGameState';
import useSoundManager from '../../utils/useSoundManager';

/**
 * PUBLIC_INTERFACE
 * MainContainer for GeoTetra Quest Tetris-style game
 * Serves as the primary container for the game with board, controls, and scoring
 */
const MainContainer = () => {
  // Use our custom hook to manage game state
  const {
    board,
    nextPiece,
    score,
    rows,
    level,
    gameOver,
    paused,
    gameStarted,
    lastAction,
    lineClear,
    levelUp,
    gameStart,
    gameOverTrigger,
    startGame,
    togglePause,
    resetGame
  } = useGameState();
  
  // Use our sound manager
  const soundManager = useSoundManager();
  
  // Track the last played sound for feedback purposes
  const [lastPlayedSound, setLastPlayedSound] = useState(null);
  
  // Handle sound effects based on game events
  useEffect(() => {
    // Only attempt to play sounds if they're loaded
    if (!soundManager.soundsLoaded) return;
    
    // Play sounds based on actions and update last played sound
    if (lastAction === 'move') {
      soundManager.playMoveSound();
      setLastPlayedSound('move');
    } else if (lastAction === 'rotate') {
      soundManager.playRotateSound();
      setLastPlayedSound('rotate');
    } else if (lastAction === 'drop') {
      soundManager.playDropSound();
      setLastPlayedSound('drop');
    } else if (lastAction === 'hardDrop') {
      soundManager.playHardDropSound();
      setLastPlayedSound('hardDrop');
    }
  }, [lastAction, soundManager]);
  
  // Handle line clear sound
  useEffect(() => {
    if (lineClear && soundManager.soundsLoaded) {
      soundManager.playLineClearSound();
      setLastPlayedSound('lineClear');
    }
  }, [lineClear, soundManager]);
  
  // Handle level up sound
  useEffect(() => {
    if (levelUp && soundManager.soundsLoaded) {
      soundManager.playLevelUpSound();
      setLastPlayedSound('levelUp');
    }
  }, [levelUp, soundManager]);
  
  // Handle game start sound
  useEffect(() => {
    if (gameStart && soundManager.soundsLoaded) {
      soundManager.playGameStartSound();
      setLastPlayedSound('gameStart');
    }
  }, [gameStart, soundManager]);
  
  // Handle game over sound
  useEffect(() => {
    if (gameOverTrigger && soundManager.soundsLoaded) {
      soundManager.playGameOverSound();
      setLastPlayedSound('gameOver');
    }
  }, [gameOverTrigger, soundManager]);
  
  // Add effect for clearing the last played sound info
  useEffect(() => {
    if (lastPlayedSound) {
      const timer = setTimeout(() => {
        setLastPlayedSound(null);
      }, 800); // Clear after sound is likely finished
      
      return () => clearTimeout(timer);
    }
  }, [lastPlayedSound]);

  return (
    <div className="geotetra-container">
      <div className="geotetra-header">
        <h1 className="geotetra-title">GeoTetra Quest</h1>
        <p className="geotetra-subtitle">Stack blocks, clear lines, score points!</p>
      </div>
      
      <div className="geotetra-game-area">
        <div className="geotetra-left-panel">
          <div className="geotetra-next-piece-container">
            <h3>Next Piece</h3>
            <div className="geotetra-next-piece">
              {/* Next piece preview */}
              <div className="geotetra-preview-grid">
                {Array.isArray(nextPiece) && nextPiece.map((row, rowIndex) => (
                  <div key={`preview-row-${rowIndex}`} className="geotetra-preview-row">
                    {Array.isArray(row) && row.map((cell, colIndex) => (
                      <div key={`preview-cell-${rowIndex}-${colIndex}`} className="geotetra-preview-cell">
                        {cell > 0 && <Block type={cell} />}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="geotetra-stats">
            <div className="geotetra-stat-item">
              <h3>Level</h3>
              <div className="geotetra-stat-value">{level}</div>
            </div>
            
            <div className="geotetra-stat-item">
              <h3>Score</h3>
              <div className="geotetra-stat-value">{score}</div>
            </div>
            
            <div className="geotetra-stat-item">
              <h3>Lines</h3>
              <div className="geotetra-stat-value">{rows}</div>
            </div>
          </div>
          
          <div className="geotetra-controls-info">
            <h3>Controls</h3>
            <ul>
              <li><span>←→</span> Move left/right</li>
              <li><span>↓</span> Soft drop</li>
              <li><span>↑</span> Rotate</li>
              <li><span>Space</span> Hard drop</li>
              <li><span>P</span> Pause game</li>
            </ul>
          </div>
        </div>
        
        <div className="geotetra-board-container">
          {/* Use the GameBoard component */}
          <GameBoard board={board} />
          
          {/* Game over overlay */}
          {gameOver && (
            <div className="geotetra-overlay">
              <h2>Game Over</h2>
              <p>Final Score: {score}</p>
              <button 
                className="geotetra-btn geotetra-btn-primary"
                onClick={startGame}
              >
                Play Again
              </button>
            </div>
          )}
          
          {/* Pause overlay */}
          {paused && !gameOver && (
            <div className="geotetra-overlay">
              <h2>Game Paused</h2>
              <button 
                className="geotetra-btn geotetra-btn-primary"
                onClick={togglePause}
              >
                Resume Game
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="geotetra-footer">
        <button 
          className="geotetra-btn geotetra-btn-primary"
          onClick={gameStarted && !gameOver ? togglePause : startGame}
        >
          {gameStarted && !gameOver ? (paused ? "Resume Game" : "Pause Game") : "Start Game"}
        </button>
        {gameStarted && !gameOver && (
          <button 
            className="geotetra-btn"
            onClick={togglePause}
          >
            {paused ? "Resume Game" : "Pause Game"}
          </button>
        )}
        <button 
          className="geotetra-btn geotetra-btn-danger"
          onClick={resetGame}
        >
          Reset
        </button>
        <button 
          className="geotetra-btn"
          onClick={soundManager.toggleMute}
        >
          {soundManager.muted ? "Unmute 🔊" : "Mute 🔇"}
        </button>
      </div>
    </div>
  );
};

export default MainContainer;
