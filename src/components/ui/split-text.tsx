import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface SplitTextProps {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
  stagger?: number;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  delay = 0,
  duration = 0.6,
  className = '',
  stagger = 0.05
}) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const chars = textRef.current.querySelectorAll('.char');
    
    gsap.set(chars, { 
      opacity: 0, 
      y: 20,
      rotationX: -90
    });

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration,
      delay,
      stagger,
      ease: "back.out(1.7)"
    });
  }, [text, delay, duration, stagger]);

  const renderText = () => {
    return text.split('').map((char, index) => (
      <span key={index} className="char inline-block">
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div ref={textRef} className={className}>
      {renderText()}
    </div>
  );
};

export default SplitText;