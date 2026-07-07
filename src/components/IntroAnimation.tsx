'use client';

import { useState, useEffect } from 'react';

export default function IntroAnimation({ text }: { text: string }) {
  const [stage, setStage] = useState<'typing' | 'pausing' | 'opening' | 'done'>('typing');
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    // Stage 1: Typing effect
    if (stage === 'typing') {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          setStage('pausing');
        }
      }, 100); // Typing speed
      return () => clearInterval(interval);
    }
    
    // Stage 2: Pause after typing
    if (stage === 'pausing') {
      const timeout = setTimeout(() => {
        setStage('opening');
      }, 1500); // Hold the text for 1.5 seconds
      return () => clearTimeout(timeout);
    }
    
    // Stage 3: Curtain opening
    if (stage === 'opening') {
      const timeout = setTimeout(() => {
        setStage('done');
      }, 1200); // Duration of the curtain animation (matches CSS)
      return () => clearTimeout(timeout);
    }
  }, [stage, text]);

  if (stage === 'done') return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 9999,
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Left Curtain */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '50%',
        height: '100%',
        backgroundColor: '#ffffff',
        transform: stage === 'opening' ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 1.2s cubic-bezier(0.77, 0, 0.175, 1)'
      }} />
      
      {/* Right Curtain */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '50%',
        height: '100%',
        backgroundColor: '#ffffff',
        transform: stage === 'opening' ? 'translateX(100%)' : 'translateX(0)',
        transition: 'transform 1.2s cubic-bezier(0.77, 0, 0.175, 1)'
      }} />

      {/* Text Container */}
      <div style={{
        position: 'relative',
        zIndex: 10000,
        color: '#111827', // Dark gray/black for luxury feel
        fontSize: 'clamp(1.5rem, 4vw, 3rem)',
        fontWeight: '300',
        letterSpacing: '0.1em',
        fontFamily: 'serif',
        opacity: stage === 'opening' ? 0 : 1,
        transition: 'opacity 0.5s ease-out'
      }}>
        {displayedText}
        <span style={{ 
          opacity: stage === 'typing' ? 1 : 0, 
          animation: 'blink 1s step-end infinite' 
        }}>|</span>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}} />
    </div>
  );
}
