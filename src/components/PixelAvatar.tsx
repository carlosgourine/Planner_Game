import React from 'react';

interface PixelAvatarProps {
    type: 'cowboy' | 'wolf';
    isAttacking?: boolean;
    isHurt?: boolean;
    className?: string;
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
            className={`bg-left bg-no-repeat ${animClass} ${className}`}
            style={{ imageRendering: 'pixelated' }}
        />
    );
};
