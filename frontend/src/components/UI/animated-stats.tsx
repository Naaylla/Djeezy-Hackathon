"use client";

import { useCountUp } from "../../lib/use-count-up";
import { useIntersectionObserver } from "../../lib/use-intersection-observer";
import { useEffect, useState } from "react";

interface AnimatedStatProps {
  value: number;
  label: string;
  suffix?: string;
  formatter?: (value: number) => string;
  delay?: number;
}

export function AnimatedStat({
  value,
  label,
  suffix = "",
  formatter,
  delay = 0,
}: AnimatedStatProps) {
  const { ref, isInView } = useIntersectionObserver<HTMLDivElement>();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay * 100);

      return () => clearTimeout(timer);
    }
  }, [isInView, delay]);

  const formattedValue = useCountUp({
    end: value,
    isInView,
    delay: delay * 100,
    formatter:
      formatter ||
      ((value) => {
        if (suffix) {
          return `${value}${suffix}`;
        }
        return value.toString();
      }),
  });

  return (
    <div
      ref={ref}
      className={`text-left transition-all duration-600 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
      style={{
        transitionDelay: `${delay * 100}ms`,
        transitionProperty: "opacity, transform",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <p className="text-[2.5rem] leading-tight font-bold">{formattedValue}</p>
      <p className="text-base mt-2 max-w-[200px]">{label}</p>
    </div>
  );
}
