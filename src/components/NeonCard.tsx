import React from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface NeonCardProps {
  children: React.ReactNode;
  className?: string;
  color?: 'pink' | 'blue' | 'green' | 'purple';
  title?: string;
}

export const NeonCard: React.FC<NeonCardProps> = ({ 
  children, 
  className, 
  color = 'blue',
  title 
}) => {
  const colorMap = {
    pink: 'border-neon-pink glow-pink',
    blue: 'border-neon-blue glow-blue',
    green: 'border-neon-green glow-green',
    purple: 'border-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.5)]',
  };

  const textColorMap = {
    pink: 'text-neon-pink text-glow-pink',
    blue: 'text-neon-blue text-glow-blue',
    green: 'text-neon-green text-glow-green',
    purple: 'text-neon-purple',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative bg-black/80 border-2 rounded-xl p-6 backdrop-blur-md",
        colorMap[color],
        className
      )}
    >
      {title && (
        <div className={cn(
          "absolute -top-4 left-6 bg-black px-3 py-1 text-xs font-bold uppercase tracking-widest border-2 rounded-md",
          colorMap[color],
          textColorMap[color]
        )}>
          {title}
        </div>
      )}
      {children}
    </motion.div>
  );
};
