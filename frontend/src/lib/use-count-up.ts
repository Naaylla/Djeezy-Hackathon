"use client";

import { useState, useEffect } from "react";

interface UseCountUpProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  isInView?: boolean;
  formatter?: (value: number) => string;
}

export function useCountUp({
  end,
  start = 0,
  duration = 2500,
  delay = 0,
  isInView = true,
  formatter = (value) => value.toString(),
}: UseCountUpProps) {
  const [count, setCount] = useState(isInView ? start : 0);
  const [shouldStart, setShouldStart] = useState(false);

  useEffect(() => {
    if (isInView && !shouldStart) {
      const timer = setTimeout(() => {
        setShouldStart(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [delay, isInView, shouldStart]);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);

      const easing = (t: number) => {
        return 1 - Math.pow(1 - t, 4);
      };

      const currentCount = Math.floor(
        start + (end - start) * easing(percentage)
      );
      setCount(currentCount);

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [start, end, duration, shouldStart]);

  return formatter(count);
}
