import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { DUMMY_TRACKS } from './constants';

export default function App() {
  return (
    <div className="h-screen w-screen grid grid-cols-[300px_1fr_300px] grid-rows-[100px_1fr_120px] bg-glitch-black text-glitch-white font-pixel overflow-hidden screen-tear">
      {/* Background Static */}
      <div className="fixed inset-0 pointer-events-none bg-static z-0" />

      {/* Header - System Identification */}
      <header className="col-span-full border-b-4 border-glitch-cyan flex items-center justify-between px-12 bg-glitch-black/90 z-10">
        <div className="text-2xl tracking-tighter text-glitch-magenta text-glitch">
          {">"} SYNTH_CORE_REBOOT
        </div>
        <div className="flex gap-12 font-mono text-2xl">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-glitch-cyan">MAX_INT_VAL</span>
            <span className="text-glitch-magenta">0xFFFFF</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-glitch-cyan">CURR_PTR</span>
            <span className="text-glitch-magenta">0x042A</span>
          </div>
        </div>
      </header>

      {/* Sidebar - Data Streams (Playlist) */}
      <aside className="border-r-4 border-glitch-magenta p-8 flex flex-col gap-6 bg-glitch-black/80 z-10">
        <div className="text-xs text-glitch-cyan mb-4 animate-pulse">DATA_STREAMS.LOG</div>
        <div className="space-y-4 font-mono text-lg">
          {DUMMY_TRACKS.map((track, index) => (
            <div 
              key={track.id}
              className={`p-4 border-2 transition-all cursor-pointer ${
                index === 0 
                  ? 'border-glitch-magenta bg-glitch-magenta/20 text-glitch-cyan' 
                  : 'border-glitch-cyan/30 hover:border-glitch-magenta hover:bg-glitch-magenta/10'
              }`}
            >
              <div className="mb-1">{`[${index}] ${track.title}`}</div>
              <div className="text-xs opacity-50">{track.artist} // CRC32: OK</div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main - Neural Interface (Game) */}
      <main className="flex items-center justify-center relative p-12 z-10">
        <div className="absolute top-4 left-4 text-[10px] text-glitch-cyan/40">
          NEURAL_LINK_ESTABLISHED...
        </div>
        <SnakeGame />
      </main>

      {/* Right Bar - Diagnostics */}
      <aside className="border-l-4 border-glitch-cyan p-8 bg-glitch-black/80 z-10">
        <div className="text-xs text-glitch-magenta mb-6">DIAGNOSTICS.EXE</div>
        <div className="h-[150px] flex items-end gap-1 my-8 border-b-2 border-glitch-magenta/30">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div 
              key={i}
              animate={{ 
                height: [
                  '10%', 
                  `${Math.random() * 90 + 10}%`, 
                  `${Math.random() * 90 + 10}%`, 
                  '10%'
                ] 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.2 + Math.random() * 0.3,
                ease: "steps(5)"
              }}
              className="flex-1 bg-glitch-magenta opacity-80"
            />
          ))}
        </div>
        
        <div className="text-xs text-glitch-cyan mb-4">OPERATIONAL_GUIDE</div>
        <div className="text-xs font-mono leading-relaxed space-y-3 opacity-70">
          <p>{">"} INPUT: ARROW_KEYS</p>
          <p>{">"} OBJECTIVE: CONSUME_NODES</p>
          <p>{">"} WARNING: SELF_COLLISION_FATAL</p>
        </div>
      </aside>

      {/* Footer - Audio Controller */}
      <footer className="col-span-full border-t-4 border-glitch-magenta bg-glitch-black/95 flex items-center px-12 z-10">
        <MusicPlayer />
      </footer>
    </div>
  );
}
