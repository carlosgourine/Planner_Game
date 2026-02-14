import React from 'react';

interface PixelAvatarProps {
    type: 'cowboy' | 'wolf';
    isAttacking?: boolean;
    isHurt?: boolean;
    className?: string; // Allow external styling/positioning
}

export const PixelAvatar: React.FC<PixelAvatarProps> = ({ type, isAttacking, isHurt, className = '' }) => {
    let animClass = '';

    if (type === 'cowboy') {
        animClass = isAttacking ? 'animate-cowboy-attack' : 'animate-cowboy-idle';
    } else if (type === 'wolf') {
        animClass = isHurt ? 'animate-wolf-hurt' : 'animate-wolf-idle';
    }

    return (
        <div
            className={`bg-no-repeat bg-left ${animClass} ${className}`}
            style={{
                // Explicitly set aspect ratio if needed, for now rely on container dimensions
                // usually w-32 h-32 or w-64 h-64
            }}
        />
    );
};
