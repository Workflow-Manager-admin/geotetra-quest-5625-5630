import { useEffect, useCallback, useRef } from 'react';

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

  // Initialize sound elements on component mount
  useEffect(() => {
    // Create audio elements
    moveSound.current = new Audio('/sounds/move.mp3');
    rotateSound.current = new Audio('/sounds/rotate.mp3');
    dropSound.current = new Audio('/sounds/drop.mp3');
    hardDropSound.current = new Audio('/sounds/hard-drop.mp3');
    lineClearSound.current = new Audio('/sounds/line-clear.mp3');
    gameOverSound.current = new Audio('/sounds/game-over.mp3');
    gameStartSound.current = new Audio('/sounds/game-start.mp3');
    levelUpSound.current = new Audio('/sounds/level-up.mp3');
    
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
    if (sound && sound.current) {
      // Reset the audio to the beginning if it's already playing
      sound.current.currentTime = 0;
      
      // Play the sound with error handling
      const playPromise = sound.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Audio playback prevented:', error);
        });
      }
    }
  }, []);

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

  return {
    playMoveSound,
    playRotateSound,
    playDropSound,
    playHardDropSound,
    playLineClearSound,
    playGameOverSound,
    playGameStartSound,
    playLevelUpSound
  };
};

export default useSoundManager;
