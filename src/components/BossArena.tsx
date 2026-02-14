import React from 'react';
import { useGameStore } from '../store/gameStore';
import { levels } from '../data/levels';
import { PixelAvatar } from './PixelAvatar';

export const BossArena: React.FC = () => {
    const { currentLevelId, bossHp, isAttacking, wolfStatus } = useGameStore();
    const level = levels.find(l => l.id === currentLevelId) || levels[0];
    const maxHp = level.maxHp;
    const healthPercentage = Math.max(0, (bossHp / maxHp) * 100);

    return (
        <div className="w-full mb-8 relative group">
            {/* Stage / Arena View */}
            <div
                className="relative w-full aspect-video max-h-[500px] bg-slate-900 border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl ring-4 ring-black/50"
            >
                {/* HUD: Fighting Game Style Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 z-30 bg-gradient-to-b from-black/60 to-transparent">
                    <div className="flex justify-between items-center mb-2 px-2 uppercase font-['Press_Start_2P'] text-[10px] md:text-xs text-white text-shadow">
                        <span>COWBOY</span>
                        <span className="text-red-500 animate-pulse">VS</span>
                        <span>{level.bossName}</span>
                    </div>

                    {/* Boss Health Bar */}
                    <div className="w-full max-w-md mx-auto h-4 bg-red-900/80 border-2 border-slate-900 relative">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-500 to-red-600 transition-all duration-200"
                            style={{ width: `${healthPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Fighting Game Background */}
                <div
                    className="absolute inset-0 z-0 bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('/background.jpg')`,
                        backgroundSize: 'cover',
                        imageRendering: 'pixelated' // Keep pixel art crisp
                    }}
                >
                    {/* Overlay for better text visibility */}
                    <div className="absolute inset-0 bg-black/10" />

                    {/* Location Indicator */}
                    <div className="absolute bottom-4 left-4 text-[#4ade80] text-xs font-mono tracking-widest opacity-80">
                        LOCATION: CITY CENTER
                    </div>
                </div>

                {/* Characters Container */}
                <div className="absolute inset-0 top-16 flex items-end justify-between px-24 md:px-48 pb-12 z-20">

                    {/* Cowboy (Player) */}
                    <div className={`transform transition-transform duration-100 ${isAttacking ? 'translate-x-24' : 'translate-x-0'}`}>
                        <div className="relative">
                            <PixelAvatar
                                type="cowboy"
                                isAttacking={isAttacking}
                                className="w-64 h-64 md:w-80 md:h-80"
                            />
                            {/* Shadow */}
                            <div className="absolute -bottom-4 left-8 w-48 h-6 bg-black/40 rounded-[100%] blur-sm" />
                        </div>
                    </div>

                    {/* Wolf (Boss) */}
                    <div className="relative">
                        <PixelAvatar
                            type="wolf"
                            isHurt={wolfStatus === 'hurt'}
                            className="w-64 h-64 md:w-80 md:h-80"
                        />
                        {/* Shadow */}
                        <div className="absolute -bottom-4 left-8 w-48 h-6 bg-black/40 rounded-[100%] blur-sm" />
                    </div>
                </div>
            </div>
        </div>
    );
};
