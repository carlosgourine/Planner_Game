import React from "react";

interface PixelAvatarProps {
    type: "cowboy" | "wolf";
    isAttacking?: boolean;
    isHurt?: boolean;
    className?: string;
}

export const PixelAvatar: React.FC<PixelAvatarProps> = ({
    type,
    isAttacking,
    isHurt,
    className = "",
}) => {
    const animClass =
        type === "cowboy"
            ? isAttacking
                ? "animate-cowboy-attack"
                : "animate-cowboy-idle"
            : isHurt
                ? "animate-wolf-hurt"
                : "animate-wolf-idle";

    return <div className={`pixel-avatar ${animClass} ${className}`} />;
};
