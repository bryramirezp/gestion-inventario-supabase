import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2,
  delay = 0,
  suffix = '',
  prefix = '',
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const counter = { value: 0 };
    
    gsap.to(counter, {
      value,
      duration,
      delay,
      ease: "power2.out",
      onUpdate: () => {
        setDisplayValue(Math.floor(counter.value));
      }
    });
  }, [value, duration, delay]);

  return (
    <span ref={counterRef} className={className}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
};

export default AnimatedCounter;