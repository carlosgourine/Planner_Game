import React from 'react';

interface SnowFlake {
  id: number;
  left: string;
  top: string;
  width: string;
  height: string;
  animationDuration: string;
  animationDelay: string;
  tx: number;
}

export const SnowParticles: React.FC = () => {
  const [snowFlakes, setSnowFlakes] = React.useState<SnowFlake[]>([]);

  React.useEffect(() => {
    setSnowFlakes([...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `-${Math.random() * 20}%`,
      width: `${Math.random() * 4 + 2}px`,
      height: `${Math.random() * 4 + 2}px`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 2}s`,
      tx: Math.random() * 50 - 25
    })));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {snowFlakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute bg-white rounded-full opacity-80 animate-snow"
          style={{
            left: flake.left,
            top: flake.top,
            width: flake.width,
            height: flake.height,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            ['--tx' as string]: `${flake.tx}px`
          }}
        />
      ))}
      <style>{`
        @keyframes snow {
          0% { transform: translateY(0) translateX(0); opacity: 0.8; }
          100% { transform: translateY(100vh) translateX(var(--tx)); opacity: 0; }
        }
        .animate-snow {
          animation-name: snow;
        }
      `}</style>
    </div>
  );
};
