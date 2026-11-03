'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
  remainingTime: number;
  onTimeout: () => void;
  totalTime?: number;
}

export function Timer({ remainingTime, onTimeout, totalTime = 900 }: TimerProps) {
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

  // Mini circular progress ring calculations (15 minutes total default)
  const radius = 6.5;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, Math.max(0, timeLeft / totalTime));
  const strokeDashoffset = circumference * (1 - progress);

  // Dynamic urgency styles
  let containerStyle = 'bg-black/25 text-emerald-300 border-emerald-400/25';
  let ringColor = 'text-emerald-400';

  if (timeLeft <= 60) {
    containerStyle =
      'bg-red-950/50 text-red-300 border-red-500/40 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.35)]';
    ringColor = 'text-red-400';
  } else if (timeLeft <= 300) {
    containerStyle =
      'bg-amber-950/40 text-amber-300 border-amber-400/30 shadow-[0_0_6px_rgba(251,191,36,0.2)]';
    ringColor = 'text-amber-400';
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-xs transition-all duration-300 select-none ${containerStyle}`}
    >
      {/* Mini Circular Progress Ring */}
      <div className={`relative flex items-center justify-center w-4 h-4 flex-shrink-0 ${ringColor}`}>
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 18 18">
          {/* Background Track */}
          <circle
            cx="9"
            cy="9"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="opacity-25"
          />
          {/* Progress Indicator */}
          <circle
            cx="9"
            cy="9"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        {/* Pulsing center indicator dot */}
        <span className="absolute w-1 h-1 rounded-full bg-current opacity-80" />
      </div>

      {/* Monospace digital time */}
      <span className="font-mono text-xs sm:text-[13px] font-semibold tracking-tight">
        {display}
      </span>
    </div>
  );
}
