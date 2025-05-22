import React, { useEffect, useState } from 'react';
import './Block.css';

/**
 * PUBLIC_INTERFACE
 * Represents a single block/cell in a tetromino piece
 * @param {Object} props - Component props
 * @param {number} props.type - Tetromino type (1-7) determining the color
 * @param {boolean} props.active - Whether this block is part of the active tetromino
 * @param {boolean} props.isLocking - Whether this block is in the process of locking into place
 * @param {boolean} props.isFalling - Whether this block is currently falling
 */
const Block = ({ 
  type = 0, 
  active = false,
  isLocking = false,
  isFalling = false
}) => {
  const [animationState, setAnimationState] = useState('');
  
  // Handle animation states with proper lifecycle
  useEffect(() => {
    let animationTimeout;
    
    // Set animation state based on props
    if (isLocking) {
      setAnimationState('locking');
      // Reset animation state after animation completes
      animationTimeout = setTimeout(() => {
        setAnimationState('');
      }, 300); // Match the CSS animation duration
    } else if (isFalling && !active) {
      setAnimationState('falling');
      // Reset animation state after animation completes
      animationTimeout = setTimeout(() => {
        setAnimationState('');
      }, 500); // Match the CSS animation duration
    }
    
    // Clean up timeout on unmount or when props change
    return () => {
      if (animationTimeout) {
        clearTimeout(animationTimeout);
      }
    };
  }, [isLocking, isFalling, active]);
  
  // Build class name based on block type and animation states
  const blockClass = type > 0 
    ? `block color-${type}${active ? ' active' : ''}${animationState ? ` ${animationState}` : ''}` 
    : 'block';
  
  return (
    <div className={blockClass}>
      <div className="block-inner"></div>
    </div>
  );
};

export default Block;
