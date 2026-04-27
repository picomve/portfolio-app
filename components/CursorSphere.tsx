'use client';

import { useEffect, useRef } from 'react';

export default function CursorSphere() {
  const sphereRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const isVisibleRef = useRef(false);

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        if (sphereRef.current) {
          sphereRef.current.style.opacity = '1';
        }
      }
    };

    const handleMouseLeave = () => {
      isVisibleRef.current = false;
      if (sphereRef.current) {
        sphereRef.current.style.opacity = '0';
      }
    };

    const animate = () => {
      if (!sphereRef.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;

      // Smooth easing - move towards target position
      posRef.current.x += (targetX - posRef.current.x) * 0.15;
      posRef.current.y += (targetY - posRef.current.y) * 0.15;

      sphereRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={sphereRef}
      className="fixed pointer-events-none z-50 opacity-0 transition-opacity duration-300"
      style={{
        width: '250px',
        height: '250px',
        left: '-100px',
        top: '-100px',
        background: 'radial-gradient(circle at 30% 30%, rgba(56, 189, 248, 0.6), rgba(56, 189, 248, 0.2), transparent)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        boxShadow: '0 0 60px rgba(56, 189, 248, 0.4)',
      }}
    />
  );
}
