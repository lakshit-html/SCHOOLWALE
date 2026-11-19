import React, { useEffect, useState } from 'react';

export const ParallaxBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized coordinates (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Deep Layer: Radial Ambient Glow Orbs */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-25 dark:opacity-20 bg-teal-400 dark:bg-brand-500 transition-transform duration-700 ease-out"
        style={{
          top: '-10%',
          left: '15%',
          transform: `translate3d(${mousePos.x * 25}px, ${mousePos.y * 25}px, 0)`
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[130px] opacity-20 dark:opacity-15 bg-cyan-400 dark:bg-cyan-600 transition-transform duration-1000 ease-out"
        style={{
          bottom: '5%',
          right: '5%',
          transform: `translate3d(${mousePos.x * -35}px, ${mousePos.y * -35}px, 0)`
        }}
      />

      {/* Mid Layer: Floating Academic Symbols with Parallax Shift */}
      <div
        className="absolute top-24 left-[8%] text-3xl font-serif opacity-15 dark:opacity-10 text-slate-400 transition-transform duration-500"
        style={{ transform: `translate3d(${mousePos.x * 18}px, ${mousePos.y * 18}px, 0)` }}
      >
        ∫
      </div>
      <div
        className="absolute top-1/3 right-[12%] text-2xl font-mono opacity-15 dark:opacity-10 text-teal-500 transition-transform duration-700"
        style={{ transform: `translate3d(${mousePos.x * -28}px, ${mousePos.y * -28}px, 0)` }}
      >
        ∑
      </div>
      <div
        className="absolute bottom-1/4 left-[14%] text-xl font-mono opacity-15 dark:opacity-10 text-cyan-500 transition-transform duration-600"
        style={{ transform: `translate3d(${mousePos.x * 32}px, ${mousePos.y * 32}px, 0)` }}
      >
        Δt
      </div>
      <div
        className="absolute bottom-32 right-[20%] text-2xl font-serif opacity-15 dark:opacity-10 text-amber-500 transition-transform duration-500"
        style={{ transform: `translate3d(${mousePos.x * -20}px, ${mousePos.y * -20}px, 0)` }}
      >
        ℏ
      </div>
      <div
        className="absolute top-2/3 left-[28%] text-lg font-mono opacity-10 dark:opacity-5 text-indigo-400 transition-transform duration-800"
        style={{ transform: `translate3d(${mousePos.x * 40}px, ${mousePos.y * 40}px, 0)` }}
      >
        e^{'{i\\pi}'} + 1 = 0
      </div>

      {/* Grid Pattern Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '36px 36px'
        }}
      />
    </div>
  );
};
