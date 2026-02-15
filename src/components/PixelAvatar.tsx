import React from 'react';

interface PixelAvatarProps {
    type: 'cowboy' | 'wolf';
    isAttacking?: boolean;
    isHurt?: boolean;
    className?: string; // Allow external styling/positioning
}

export const PixelAvatar: React.FC<PixelAvatarProps> = ({ type, isAttacking, isHurt, className = '' }) => {
    let imgSrc = '';
    let frames = 1;
    let animClass = '';

    if (type === 'cowboy') {
        imgSrc = isAttacking ? '/cowboyfightreal.png' : '/cowboybreathing.png';
        frames = isAttacking ? 6 : 4;
        animClass = isAttacking ? 'animate-sprite-6' : 'animate-sprite-4';
    } else if (type === 'wolf') {
        imgSrc = isHurt ? '/wolfhurt.png' : '/wolfbreathing.png';
        frames = isHurt ? 3 : 4;
        animClass = isHurt ? 'animate-sprite-3' : 'animate-sprite-4';
    }

    return (
        /* The container hides the extra frames */
        <div className={`overflow-hidden relative ${className}`}>
            {/* The image is super wide, and CSS slides it to the left step-by-step */}
            <img
                src={imgSrc}
                alt={type}
                className={`absolute top-0 left-0 h-full max-w-none ${animClass}`}
                style={{
                    width: `${frames * 100}%`,
                    imageRendering: 'pixelated' /* Keeps the pixel art sharp! */
                }}
            />
        </div>
    );
};
