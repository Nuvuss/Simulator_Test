'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  remainingTime: number;
  onTimeout: () => void;
}

export function Timer({ remainingTime, onTimeout }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(Math.ceil(remainingTime));

  useEffect(() => {
    setTimeLeft(Math.ceil(remainingTime));
  }, [remainingTime]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeout]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  let colorClass = 'text-green-300';
  if (timeLeft <= 60) {
    colorClass = 'text-red-400 animate-pulse font-bold';
  } else if (timeLeft <= 300) {
    colorClass = 'text-yellow-300';
  }

  return (
    <div className={`font-mono text-sm ${colorClass}`}>
      ⏱ {display}
    </div>
  );
}
