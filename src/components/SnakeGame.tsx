import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, GameStatus } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { cn } from '../lib/utils';
import { Trophy, Play, RotateCcw, Pause } from 'lucide-react';

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setStatus('PLAYING');
    setFood(generateFood(INITIAL_SNAKE));
  };

  const moveSnake = useCallback(() => {
    if (status !== 'PLAYING') return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus('GAME_OVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, status, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (status === 'PLAYING') setStatus('PAUSED');
          else if (status === 'PAUSED') setStatus('PLAYING');
          else if (status === 'IDLE' || status === 'GAME_OVER') resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, status]);

  useEffect(() => {
    if (status === 'PLAYING') {
      const loop = (time: number) => {
        if (time - lastUpdateRef.current > GAME_SPEED) {
          moveSnake();
          lastUpdateRef.current = time;
        }
        gameLoopRef.current = requestAnimationFrame(loop);
      };
      gameLoopRef.current = requestAnimationFrame(loop);
    } else if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
    }

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [status, moveSnake]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] px-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-neon-green" />
          <span className="text-sm font-mono text-neon-green uppercase tracking-tighter">Score: {score}</span>
        </div>
        <div className="flex items-center gap-2 opacity-60">
          <span className="text-xs font-mono uppercase tracking-tighter">Best: {highScore}</span>
        </div>
      </div>

      <div 
        className="relative bg-glitch-black border-4 border-glitch-cyan shadow-[8px_8px_0_var(--color-glitch-magenta)] overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none opacity-10">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-glitch-cyan/20" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <div 
            key={i}
            className={cn(
              "absolute w-[20px] h-[20px] transition-all duration-150",
              i === 0 ? "bg-glitch-white z-10 shadow-[0_0_10px_var(--color-glitch-cyan)]" : "bg-glitch-cyan shadow-[0_0_5px_var(--color-glitch-magenta)]"
            )}
            style={{ 
              left: segment.x * 20, 
              top: segment.y * 20 
            }}
          />
        ))}

        {/* Food */}
        <div 
          className="absolute w-[20px] h-[20px] bg-glitch-magenta animate-pulse scale-90 shadow-[0_0_15px_var(--color-glitch-magenta)]"
          style={{ 
            left: food.x * 20, 
            top: food.y * 20 
          }}
        />

        {/* Overlays */}
        {status !== 'PLAYING' && (
          <div className="absolute inset-0 bg-glitch-black/95 backdrop-blur-md flex flex-col items-center justify-center z-20 p-8 text-center">
            {status === 'IDLE' && (
              <>
                <h2 className="text-2xl font-bold text-glitch-cyan text-glitch mb-8 uppercase tracking-tighter">INITIALIZE_LINK?</h2>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-4 bg-glitch-cyan/10 border-4 border-glitch-cyan text-glitch-cyan px-10 py-5 hover:bg-glitch-cyan/30 transition-all group font-pixel text-xs shadow-[4px_4px_0_var(--color-glitch-magenta)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  {">"} EXECUTE
                </button>
                <p className="mt-8 text-[10px] text-glitch-white/40 uppercase tracking-widest">CMD: ARROWS_TO_NAVIGATE</p>
              </>
            )}
            {status === 'PAUSED' && (
              <>
                <h2 className="text-2xl font-bold text-glitch-magenta text-glitch mb-8 uppercase tracking-tighter">HALT_STATE</h2>
                <button 
                  onClick={() => setStatus('PLAYING')}
                  className="flex items-center gap-4 bg-glitch-magenta/10 border-4 border-glitch-magenta text-glitch-magenta px-10 py-5 hover:bg-glitch-magenta/30 transition-all font-pixel text-xs shadow-[4px_4px_0_var(--color-glitch-cyan)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  {">"} RESUME
                </button>
              </>
            )}
            {status === 'GAME_OVER' && (
              <>
                <h2 className="text-2xl font-bold text-glitch-magenta text-glitch mb-4 uppercase tracking-tighter">CRITICAL_FAILURE</h2>
                <p className="text-lg font-mono text-glitch-cyan mb-8 tracking-tighter">DATA_LOSS: {score.toString(16).toUpperCase()}h</p>
                <button 
                  onClick={resetGame}
                  className="flex items-center gap-4 bg-glitch-magenta/10 border-4 border-glitch-magenta text-glitch-magenta px-10 py-5 hover:bg-glitch-magenta/30 transition-all font-pixel text-xs shadow-[4px_4px_0_var(--color-glitch-cyan)] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  {">"} REBOOT
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-12">
        <div className="flex items-center gap-3 text-[10px] text-glitch-cyan uppercase tracking-widest font-bold">
          <div className="w-3 h-3 bg-glitch-cyan shadow-[2px_2px_0_var(--color-glitch-magenta)]" />
          ENTITY
        </div>
        <div className="flex items-center gap-3 text-[10px] text-glitch-magenta uppercase tracking-widest font-bold">
          <div className="w-3 h-3 bg-glitch-magenta shadow-[2px_2px_0_var(--color-glitch-cyan)]" />
          NODE
        </div>
      </div>
    </div>
  );
};
