"use client";

import { useMemo } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

// Generate stars deterministically using a seed to avoid hydration mismatch
function generateStars(count: number): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: ((i * 17 + 13) % 100),
    y: ((i * 23 + 7) % 100),
    size: ((i * 7) % 15) / 10 + 0.5,
    opacity: ((i * 11) % 7) / 10 + 0.3,
    delay: ((i * 3) % 40) / 10,
    duration: 3 + ((i * 5) % 20) / 10,
  }));
}

export function StarField({ count = 100 }: { count?: number }) {
  // useMemo for expensive computation that depends on count (Rule 5.6)
  const stars = useMemo(() => generateStars(count), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
