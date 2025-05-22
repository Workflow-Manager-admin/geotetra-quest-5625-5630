import React, { useState } from 'react';
import './MainContainer.css';
import GameBoard from '../GameBoard/GameBoard';
import Block from '../Block/Block';

/**
 * PUBLIC_INTERFACE
 * MainContainer for GeoTetra Quest Tetris-style game
 * Serves as the primary container for the game with board, controls, and scoring
 */
const MainContainer = () => {
  // Create a demo board state with some blocks for visual appeal
  const generateDemoBoard = () => {
    const emptyBoard = Array(20).fill().map(() => Array(10).fill(0));
    
    // Add some sample blocks at the bottom for visualization
    for (let row = 16; row < 20; row++) {
      for (let col = 0; col < 10; col++) {
        // Create a pattern of blocks
        if ((row + col) % 3 === 0) {
          emptyBoard[row][col] = ((row * col) % 7) + 1;
        } else if ((row + col) % 7 === 0) {
          emptyBoard[row][col] = ((row + col) % 7) + 1;
        }
      }
    }
    
    // Add an active tetromino in the middle (T-piece)
    emptyBoard[5][4] = 6;
    emptyBoard[5][5] = 6;
    emptyBoard[5][6] = 6;
    emptyBoard[4][5] = 6;
    
    return emptyBoard;
  };

  // Placeholder board state for demonstration
  const [board] = useState(generateDemoBoard());
  
  // Sample next piece for preview (L-piece)
  const [nextPiece] = useState([
    [0, 0, 0, 0],
    [0, 3, 0, 0],
    [0, 3, 0, 0],
    [0, 3, 3, 0]
  ]);

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
              <div className="geotetra-stat-value">1</div>
            </div>
            
            <div className="geotetra-stat-item">
              <h3>Score</h3>
              <div className="geotetra-stat-value">0</div>
            </div>
            
            <div className="geotetra-stat-item">
              <h3>Lines</h3>
              <div className="geotetra-stat-value">0</div>
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
        <button className="geotetra-btn geotetra-btn-primary">Start Game</button>
        <button className="geotetra-btn">Pause Game</button>
        <button className="geotetra-btn geotetra-btn-danger">Reset</button>
      </div>
    </div>
  );
};

export default MainContainer;
