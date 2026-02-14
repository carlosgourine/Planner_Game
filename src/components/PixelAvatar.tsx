import React from 'react';

interface PixelAvatarProps {
    type: 'player' | 'boss';
    bossId?: number;
    scale?: number;
}

export const PixelAvatar: React.FC<PixelAvatarProps> = ({ type, scale = 2 }) => {
    const spriteStyle: React.CSSProperties = {
        backgroundImage: `url('/characters.png')`,
        backgroundSize: '200% 100%',
        backgroundRepeat: 'no-repeat',
        imageRendering: 'pixelated',
        width: '100%',
        height: '100%',
    };

    const position = type === 'player'
        ? { backgroundPosition: '0% 0%' }  // Left half (Player)
        : { backgroundPosition: '100% 0%' }; // Right half (Boss)

    return (
        <div className={`overflow-hidden flex items-center justify-center relative ${scale > 1 ? 'w-64 h-64' : 'w-32 h-32'}`} style={{ transform: `scale(${scale})` }}>
            <div style={{ ...spriteStyle, ...position, position: 'absolute', inset: 0 }} />
        </div>
    );
};
