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
  
  // State to track mute status and sound loading
  const [muted, setMuted] = useState(false);
  const [soundsLoaded, setSoundsLoaded] = useState(false);
  const [loadingErrors, setLoadingErrors] = useState([]);
  
  // Define sound file paths
  const soundFiles = useRef({
    move: 'move.mp3',
    rotate: 'rotate.mp3',
    drop: 'drop.mp3',
    hardDrop: 'hard-drop.mp3',
    lineClear: 'line-clear.mp3',
    gameOver: 'game-over.mp3',
    gameStart: 'game-start.mp3',
    levelUp: 'level-up.mp3'
  });
  
  // Function to preload all sounds
  const preloadSounds = useCallback(() => {
    const publicUrl = process.env.PUBLIC_URL || '';
    const errors = [];
    const soundsToLoad = Object.keys(soundFiles.current).length;
    let loadedCount = 0;
    
    // Create and configure all audio elements
    moveSound.current = new Audio(`${publicUrl}/sounds/${soundFiles.current.move}`);
    rotateSound.current = new Audio(`${publicUrl}/sounds/${soundFiles.current.rotate}`);
    dropSound.current = new Audio(`${publicUrl}/sounds/${soundFiles.current.drop}`);
    hardDropSound.current = new Audio(`${publicUrl}/sounds/${soundFiles.current.hardDrop}`);
    lineClearSound.current = new Audio(`${publicUrl}/sounds/${soundFiles.current.lineClear}`);
    gameOverSound.current = new Audio(`${publicUrl}/sounds/${soundFiles.current.gameOver}`);
    gameStartSound.current = new Audio(`${publicUrl}/sounds/${soundFiles.current.gameStart}`);
    levelUpSound.current = new Audio(`${publicUrl}/sounds/${soundFiles.current.levelUp}`);
    
    const sounds = [
      { ref: moveSound, name: 'move' },
      { ref: rotateSound, name: 'rotate' },
      { ref: dropSound, name: 'drop' },
      { ref: hardDropSound, name: 'hardDrop' },
      { ref: lineClearSound, name: 'lineClear' },
      { ref: gameOverSound, name: 'gameOver' },
      { ref: gameStartSound, name: 'gameStart' },
      { ref: levelUpSound, name: 'levelUp' }
    ];
    
    // Set volume and add event listeners for all sounds
    sounds.forEach(sound => {
      if (sound.ref.current) {
        // Set volume
        sound.ref.current.volume = 0.5;
        
        // Add load event listener
        sound.ref.current.addEventListener('canplaythrough', () => {
          loadedCount++;
          if (loadedCount === soundsToLoad) {
            setSoundsLoaded(true);
          }
        }, { once: true });
        
        // Add error event listener
        sound.ref.current.addEventListener('error', (e) => {
          errors.push(`Failed to load ${sound.name} sound: ${e.message || 'Unknown error'}`);
          setLoadingErrors([...errors]);
          
          // Still count as "loaded" even if it errored
          loadedCount++;
          if (loadedCount === soundsToLoad) {
            setSoundsLoaded(true);
          }
        }, { once: true });
        
        // Attempt to load the sound by setting preload attribute
        sound.ref.current.preload = 'auto';
        
        // Also try forcing a load 
        try {
          sound.ref.current.load();
        } catch (err) {
          console.warn(`Error pre-loading sound ${sound.name}:`, err);
        }
      }
    });
  }, []);

  // Initialize sound elements on component mount
  useEffect(() => {
    // Preload all sounds
    preloadSounds();
    
    // Get all sound refs for cleanup
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
    
    // Cleanup function to prevent memory leaks
    return () => {
      sounds.forEach(sound => {
        if (sound) {
          sound.pause();
          sound.currentTime = 0;
        }
      });
    };
  }, [preloadSounds]);

  // Helper function to play a sound with error handling
  const playSound = useCallback((sound) => {
    if (sound && sound.current && !muted) {
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
