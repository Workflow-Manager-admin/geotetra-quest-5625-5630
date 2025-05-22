import React from 'react';
import './GameBoard.css';
import Block from '../Block/Block';

/**
 * PUBLIC_INTERFACE
 * GameBoard component for rendering the tetris game grid
 * @param {Object} props - Component props
 * @param {Array} props.board - 2D array representing the game board state
 */
const GameBoard = ({ board = Array(20).fill().map(() => Array(10).fill(0)) }) => {
  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="board-row">
          {row.map((cell, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="board-cell">
              <Block type={cell} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
