import React from 'react';
import './MainContainer.css';

/**
 * PUBLIC_INTERFACE
 * MainContainer for GeoTetra Quest Tetris-style game
 * Serves as the primary container for the game with board, controls, and scoring
 */
const MainContainer = () => {
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
              {/* Placeholder for next piece preview */}
              <div className="geotetra-preview-grid">
                {Array(4).fill().map((_, row) => (
                  <div key={`preview-row-${row}`} className="geotetra-preview-row">
                    {Array(4).fill().map((_, col) => (
                      <div key={`preview-cell-${row}-${col}`} className="geotetra-preview-cell"></div>
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
          <div className="geotetra-board">
            {/* Game board grid - 10x20 standard Tetris board */}
            {Array(20).fill().map((_, row) => (
              <div key={`row-${row}`} className="geotetra-row">
                {Array(10).fill().map((_, col) => (
                  <div key={`cell-${row}-${col}`} className="geotetra-cell"></div>
                ))}
              </div>
            ))}
          </div>
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
