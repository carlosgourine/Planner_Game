import React from 'react';
import { useGameStore } from '../store/gameStore';
import { PixelAvatar } from './PixelAvatar';
import { levels } from '../data/levels';

export const BossArena: React.FC = () => {
    // Get all necessary data from the store
    const { bossHp, currentLevelId, isAttacking, wolfStatus } = useGameStore();

    // Calculate max health based on current level
    const level = levels.find(l => l.id === currentLevelId) || levels[0];
    const maxBossHp = level.maxHp;

    const healthPercentage = (bossHp / maxBossHp) * 100;

    return (
        // Container for the entire game view
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-xl shadow-2xl border-4 border-slate-800 bg-black">

            {/* --- BACKGROUND IMAGE --- */}
            {/* Using a real img tag ensures it doesn't stretch or distort */}
            <img
                src="/background.jpg"
                alt="Fight Arena"
                className="w-full h-auto block"
                style={{ imageRendering: 'pixelated' }}
            />

            {/* --- HUD LAYER --- */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20">
                {/* Names */}
                <div className="flex justify-between mb-2 px-2 font-['Press_Start_2P'] text-xs text-white text-shadow-lg">
                    <span>COWBOY</span>
                    <span>WOLF</span> {/* Fixed text */}
                </div>
                {/* Health Bar */}
                <div className="w-full h-6 bg-slate-900 border-2 border-slate-700 relative shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-red-500 to-red-700 transition-all duration-300 ease-out origin-left"
                        style={{ width: `${healthPercentage}%` }}
                    />
                </div>
            </div>

            {/* --- FIGHTERS LAYER --- */}
            <div className="absolute inset-0 z-10 pointer-events-none">

                {/* COWBOY POSITIONING */}
                {/* Bottom-left placement with a slight forward slide on attack */}
                <div className={`absolute bottom-12 left-16 md:left-24 z-20 transition-transform duration-100 ${isAttacking ? 'translate-x-12' : ''}`}>
                    <div className="relative">
                        <PixelAvatar
                            type="cowboy"
                            isAttacking={isAttacking}
                            // Fixed, smaller size for sharp pixel art
                            className="w-32 h-32 md:w-40 md:h-40 relative z-10"
                        />
                        {/* Shadow */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/50 rounded-[100%] blur-sm z-0" />
                    </div>
                </div>

                {/* WOLF POSITIONING */}
                {/* Bottom-right placement */}
                <div className="absolute bottom-12 right-16 md:right-24 z-10">
                    <div className="relative">
                        <PixelAvatar
                            type="wolf"
                            isHurt={wolfStatus === 'hurt'}
                            // Fixed size & FLIPPED to face left
                            className="w-32 h-32 md:w-40 md:h-40 scale-x-[-1] relative z-10"
                        />
                        {/* Shadow */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/50 rounded-[100%] blur-sm z-0" />
                    </div>
                </div>

            </div>
        </div>
    );
};


