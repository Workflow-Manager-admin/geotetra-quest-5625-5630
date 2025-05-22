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
 * @param {boolean} props.isClearing - Whether this block is part of a line being cleared
 */
const Block = ({ 
  type = 0, 
  active = false,
  isLocking = false,
  isFalling = false,
  isClearing = false
}) => {
  const [animationState, setAnimationState] = useState('');
  const [justLocked, setJustLocked] = useState(false);
  
  // Handle animation states with proper lifecycle
  useEffect(() => {
    let animationTimeout;
    
    // Set animation state based on props - prioritize clearing over other animations
    if (isClearing) {
      setAnimationState('clearing');
      // Reset animation state after animation completes
      animationTimeout = setTimeout(() => {
        setAnimationState('');
      }, 800); // Match the CSS animation duration
    } else if (isLocking) {
      setAnimationState('locking');
      setJustLocked(true);
      
      // Reset animation state after animation completes
      animationTimeout = setTimeout(() => {
        setAnimationState('');
        
        // Schedule removal of justLocked state after shadow pulse completes
        setTimeout(() => {
          setJustLocked(false);
        }, 800);
      }, 400); // Match the CSS animation duration
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
  }, [isLocking, isFalling, active, isClearing]);
  
  // Build class name based on block type and animation states
  const blockClass = type > 0 
    ? `block color-${type}${active ? ' active' : ''}${animationState ? ` ${animationState}` : ''}${justLocked ? ' just-locked' : ''}` 
    : 'block';
  
  return (
    <div className={blockClass}>
      <div className="block-inner"></div>
    </div>
  );
};

export default Block;
