import React, { useEffect } from 'react';
import './MainContainer.css';
import GameBoard from '../GameBoard/GameBoard';
import Block from '../Block/Block';
import { useGameState } from '../../utils/useGameState';

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
    startGame,
    togglePause,
    resetGame
  } = useGameState();

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
                {nextPiece.map((row, rowIndex) => (
                  <div key={`preview-row-${rowIndex}`} className="geotetra-preview-row">
                    {row.map((cell, colIndex) => (
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
      </div>
    </div>
  );
};

export default MainContainer;
