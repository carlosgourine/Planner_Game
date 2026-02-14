import React from 'react';

export const SnowParticles: React.FC = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute bg-white rounded-full opacity-80 animate-snow"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `-${Math.random() * 20}%`,
                        width: `${Math.random() * 4 + 2}px`,
                        height: `${Math.random() * 4 + 2}px`,
                        animationDuration: `${Math.random() * 3 + 2}s`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationIterationCount: 'infinite',
                        animationTimingFunction: 'linear'
                    }}
                />
            ))}
            <style>{`
        @keyframes snow {
          0% { transform: translateY(0) translateX(0); opacity: 0.8; }
          100% { transform: translateY(100vh) translateX(${Math.random() * 50 - 25}px); opacity: 0; }
        }
        .animate-snow {
          animation-name: snow;
        }
      `}</style>
        </div>
    );
};
