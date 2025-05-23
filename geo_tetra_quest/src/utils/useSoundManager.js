import { useEffect, useCallback, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * Custom hook for managing game sound effects
 * Provides functions to play various game sounds
 * @returns {Object} Object containing functions to play different game sounds
 */
const useSoundManager = () => {
  // Create refs for audio elements to prevent recreation on each render
  const moveSound = useRef(null);
  const rotateSound = useRef(null);
  const dropSound = useRef(null);
  const hardDropSound = useRef(null);
  const lineClearSound = useRef(null);
  const gameOverSound = useRef(null);
  const gameStartSound = useRef(null);
  const levelUpSound = useRef(null);
  
  // State to track mute status
  const [muted, setMuted] = useState(false);
  
  // Initialize sound elements on component mount
  useEffect(() => {
    // Create audio elements with the process.env.PUBLIC_URL prefix for correct path resolution
    const publicUrl = process.env.PUBLIC_URL || '';
    moveSound.current = new Audio(`${publicUrl}/sounds/move.mp3`);
    rotateSound.current = new Audio(`${publicUrl}/sounds/rotate.mp3`);
    dropSound.current = new Audio(`${publicUrl}/sounds/drop.mp3`);
    hardDropSound.current = new Audio(`${publicUrl}/sounds/hard-drop.mp3`);
    lineClearSound.current = new Audio(`${publicUrl}/sounds/line-clear.mp3`);
    gameOverSound.current = new Audio(`${publicUrl}/sounds/game-over.mp3`);
    gameStartSound.current = new Audio(`${publicUrl}/sounds/game-start.mp3`);
    levelUpSound.current = new Audio(`${publicUrl}/sounds/level-up.mp3`);
    
    // Set volume for all sounds
    const sounds = [
      moveSound.current,
      rotateSound.current,
      dropSound.current,
      hardDropSound.current,
      lineClearSound.current,
      gameOverSound.current,
      gameStartSound.current,
      levelUpSound.current
    ];
    
    sounds.forEach(sound => {
      if (sound) {
        sound.volume = 0.5; // Set to 50% volume
        
        // Try to pre-load the sound
        try {
          sound.load();
        } catch (err) {
          console.warn('Error loading sound:', err);
        }
      }
    });
    
    // Cleanup function to prevent memory leaks
    return () => {
      sounds.forEach(sound => {
        if (sound) {
          sound.pause();
          sound.currentTime = 0;
        }
      });
    };
  }, []);

  // Helper function to play a sound with error handling
  const playSound = useCallback((sound) => {
    if (sound && sound.current && !muted) {
      try {
        // Reset the audio to the beginning if it's already playing
        sound.current.currentTime = 0;
        
        // Play the sound with error handling
        const playPromise = sound.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn('Audio playback prevented:', error);
          });
        }
      } catch (error) {
        console.warn('Error playing sound:', error);
      }
    }
  }, [muted]);

  // Public sound functions
  const playMoveSound = useCallback(() => {
    playSound(moveSound);
  }, [playSound]);

  const playRotateSound = useCallback(() => {
    playSound(rotateSound);
  }, [playSound]);

  const playDropSound = useCallback(() => {
    playSound(dropSound);
  }, [playSound]);
  
  const playHardDropSound = useCallback(() => {
    playSound(hardDropSound);
  }, [playSound]);

  const playLineClearSound = useCallback(() => {
    playSound(lineClearSound);
  }, [playSound]);

  const playGameOverSound = useCallback(() => {
    playSound(gameOverSound);
  }, [playSound]);

  const playGameStartSound = useCallback(() => {
    playSound(gameStartSound);
  }, [playSound]);
  
  const playLevelUpSound = useCallback(() => {
    playSound(levelUpSound);
  }, [playSound]);

  // Toggle mute function
  const toggleMute = useCallback(() => {
    setMuted(prevMuted => !prevMuted);
  }, []);

  return {
    playMoveSound,
    playRotateSound,
    playDropSound,
    playHardDropSound,
    playLineClearSound,
    playGameOverSound,
    playGameStartSound,
    playLevelUpSound,
    toggleMute,
    muted
  };
};

export default useSoundManager;
