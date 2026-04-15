import React, { useState, useRef, useEffect } from 'react';
import { DUMMY_TRACKS } from '../constants';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export const MusicPlayer: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = DUMMY_TRACKS[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center w-full gap-12 font-mono">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleNext}
      />

      {/* Now Playing - Cryptic Info */}
      <div className="w-[300px] flex items-center gap-4">
        <div className="w-16 h-16 border-2 border-glitch-cyan bg-glitch-magenta/20 flex-shrink-0 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentTrack.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-full h-full object-cover grayscale contrast-150"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-glitch-cyan/10 pointer-events-none" />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold truncate text-glitch-cyan uppercase">{currentTrack.title}</div>
          <div className="text-[10px] text-glitch-magenta truncate uppercase tracking-tighter">{`BY: ${currentTrack.artist}`}</div>
        </div>
      </div>

      {/* Controls - Jarring Buttons */}
      <div className="flex-1 flex flex-col items-center gap-4">
        <div className="flex items-center gap-10">
          <button 
            onClick={handlePrev}
            className="text-glitch-cyan hover:text-glitch-magenta transition-colors"
          >
            <SkipBack className="w-6 h-6" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 bg-glitch-cyan text-glitch-black flex items-center justify-center hover:bg-glitch-magenta transition-all shadow-[4px_4px_0_var(--color-glitch-magenta)] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-glitch-cyan hover:text-glitch-magenta transition-colors"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full max-w-[600px] h-2 bg-glitch-cyan/20 relative overflow-hidden border border-glitch-cyan/40">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-glitch-magenta shadow-[0_0_10px_var(--color-glitch-magenta)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Volume / Time - Machine Readout */}
      <div className="w-[300px] flex justify-end items-center gap-6 text-xs text-glitch-cyan">
        <span className="tracking-tighter">{`${formatTime(audioRef.current?.currentTime || 0)} // ${formatTime(duration)}`}</span>
        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-glitch-magenta" />
          <span className="text-glitch-magenta">0x64</span>
        </div>
      </div>
    </div>
  );
};
