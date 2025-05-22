import React, { useEffect, useState } from 'react';
import './GameBoard.css';
import Block from '../Block/Block';

/**
 * PUBLIC_INTERFACE
 * GameBoard component for rendering the tetris game grid
 * @param {Object} props - Component props
 * @param {Array} props.board - 2D array representing the game board state
 * @param {Array} props.clearingLines - Array of row indices that are being cleared
 * @param {boolean} props.lineClear - Flag indicating if line clear animation should play
 */
const GameBoard = ({ 
  board = Array(20).fill().map(() => Array(10).fill(0)), 
  clearingLines = [], 
  lineClear = false 
}) => {
  // Track which rows are in the clearing animation state
  const [animatingRows, setAnimatingRows] = useState([]);
  
  // Handle line clear animations
  useEffect(() => {
    if (lineClear && clearingLines.length > 0) {
      // Set the rows that are being cleared for animation
      setAnimatingRows(clearingLines);
      
      // Remove animation classes after animation completes
      const timer = setTimeout(() => {
        setAnimatingRows([]);
      }, 800); // Match the combined animation duration (0.5s + 0.3s)
      
      return () => clearTimeout(timer);
    }
  }, [lineClear, clearingLines]);

  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div 
          key={`row-${rowIndex}`} 
          className={`board-row ${animatingRows.includes(rowIndex) ? 'clearing' : ''}`}
        >
          {row.map((cell, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="board-cell">
              <Block 
                type={cell} 
                isFalling={cell > 0 && !animatingRows.includes(rowIndex)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
