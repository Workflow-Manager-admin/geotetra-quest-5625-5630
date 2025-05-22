import React from 'react';
import './Block.css';

/**
 * PUBLIC_INTERFACE
 * Represents a single block/cell in a tetromino piece
 * @param {Object} props - Component props
 * @param {number} props.type - Tetromino type (1-7) determining the color
 * @param {boolean} props.active - Whether this block is part of the active tetromino
 */
const Block = ({ type = 0, active = false }) => {
  const blockClass = type > 0 
    ? `block color-${type}${active ? ' active' : ''}` 
    : 'block';
  
  return (
    <div className={blockClass}>
      <div className="block-inner"></div>
    </div>
  );
};

export default Block;
