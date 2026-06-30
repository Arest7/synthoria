'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Note {
  id: number;
  char: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  colorClass: string;
}

const NOTE_CHARS = ['♩', '♪', '♫', '♬', '♭', '♮', '♯', '𝄞', '𝄢'];
const COLOR_CLASSES = [
  'text-primary/15 dark:text-primary/30',
  'text-secondary/15 dark:text-secondary/30',
  'text-accent/10 dark:text-accent/20',
];

export const FloatingNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    // Generate random floating notes
    const generated: Note[] = Array.from({ length: 15 }).map((_, idx) => {
      const char = NOTE_CHARS[Math.floor(Math.random() * NOTE_CHARS.length)];
      const x = Math.random() * 100; // Percentage
      const y = 80 + Math.random() * 20; // Bottom region
      const size = 20 + Math.random() * 30; // pixels
      const delay = Math.random() * 5;
      const duration = 15 + Math.random() * 15; // seconds
      const colorClass = COLOR_CLASSES[Math.floor(Math.random() * COLOR_CLASSES.length)];
      
      return { id: idx, char, x, y, size, delay, duration, colorClass };
    });
    
    setNotes(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {notes.map((note) => (
        <motion.div
          key={note.id}
          className={`absolute font-bold select-none ${note.colorClass}`}
          style={{
            left: `${note.x}%`,
            top: `${note.y}%`,
            fontSize: `${note.size}px`,
          }}
          initial={{ y: 0, opacity: 0, scale: 0.8 }}
          animate={{
            y: -800,
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.8, 1.1, 0.9, 0.7],
          }}
          transition={{
            duration: note.duration,
            delay: note.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {note.char}
        </motion.div>
      ))}
    </div>
  );
};
export default FloatingNotes;
