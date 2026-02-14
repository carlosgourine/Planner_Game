import React from 'react';
import { useGameStore } from '../store/gameStore';
import { levels } from '../data/levels';
import { motion } from 'framer-motion';
import { PixelAvatar } from './PixelAvatar';
import { SnowParticles } from './SnowParticles';

export const BossArena: React.FC = () => {
    const { currentLevelId, bossHp } = useGameStore();
    const level = levels.find(l => l.id === currentLevelId) || levels[0];
    const maxHp = level.maxHp;
    const healthPercentage = Math.max(0, (bossHp / maxHp) * 100);

    return (
        <div className="w-full mb-8 relative group">

            {/* Stage / Arena View */}
            <div className="relative w-full aspect-video max-h-[500px] bg-black border-4 border-slate-700 rounded-xl overflow-hidden shadow-2xl ring-4 ring-black/50">

                {/* Dynamic Background: Urban Tundra */}
                <div className="absolute inset-0 bg-urban-tundra z-0">
                    {/* Moon/Glow */}
                    <div className="absolute top-10 right-20 w-24 h-24 rounded-full bg-blue-400/20 blur-[40px]" />

                    {/* Distant City Skyline (CSS Art) */}
                    <div className="absolute bottom-16 left-0 right-0 h-40 flex items-end justify-center opacity-40 px-10 gap-2">
                        <div className="w-10 h-20 bg-slate-900" />
                        <div className="w-14 h-32 bg-slate-800" />
                        <div className="w-8 h-16 bg-slate-900" />
                        <div className="w-20 h-40 bg-slate-950" />
                        <div className="w-12 h-24 bg-slate-800" />
                        <div className="w-16 h-28 bg-slate-900" />
                        <div className="w-24 h-12 bg-slate-950" />
                    </div>
                    <div className="absolute bottom-16 left-20 right-20 h-50 flex items-end justify-between opacity-30 px-20">
                        <div className="w-16 h-52 bg-indigo-950" />
                        <div className="w-12 h-36 bg-indigo-900" />
                        <div className="w-24 h-44 bg-indigo-950" />
                    </div>
                </div>

                <SnowParticles />

                {/* Floor */}
                <div className="absolute bottom-0 w-full h-16 bg-slate-900 border-t-4 border-slate-600/50 z-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-80" />

                {/* Fighting Game HUD (Overlay) */}
                <div className="absolute top-0 left-0 right-0 p-4 z-30 bg-gradient-to-b from-black/80 to-transparent pb-12">
                    <div className="flex justify-between items-center mb-2 px-2 uppercase font-['Press_Start_2P'] text-[10px] md:text-xs text-yellow-400 text-shadow">
                        <div className="flex flex-col items-start gap-1">
                            <span className="bg-yellow-900/80 px-2 py-1 border border-yellow-500 rounded text-yellow-100">YOU</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl text-red-500 animate-pulse font-bold tracking-widest italic" style={{ textShadow: "0 0 10px red" }}>VS</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="bg-blue-900/80 px-2 py-1 border border-blue-500 rounded text-blue-100">{level.bossName}</span>
                        </div>
                    </div>

                    {/* Health Bars */}
                    <div className="flex justify-between items-center gap-2 md:gap-4">
                        {/* Player Bar */}
                        <div className="flex-1 h-6 bg-slate-900/80 border-2 border-slate-600 relative skew-x-[-15deg] overflow-hidden shadow-lg">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-600 w-full" />
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')] opacity-20" />
                        </div>

                        {/* Timer */}
                        <div className="w-12 h-12 flex-shrink-0 bg-slate-800 rounded-full border-2 border-slate-500 flex items-center justify-center relative z-10 shadow-lg">
                            <span className="font-['Press_Start_2P'] text-sm text-white">∞</span>
                        </div>

                        {/* Boss Bar */}
                        <div className="flex-1 h-6 bg-slate-900/80 border-2 border-red-900 relative skew-x-[15deg] overflow-hidden shadow-lg">
                            <motion.div
                                className="h-full bg-gradient-to-l from-red-600 to-rose-700 absolute right-0 top-0 bottom-0"
                                initial={{ width: '100%' }}
                                animate={{ width: `${healthPercentage}%` }}
                                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                            />
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-striped-brick.png')] opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Characters */}
                <div className="absolute inset-0 top-16 flex items-end justify-between px-8 md:px-24 pb-12 z-20">
                    {/* Player Sprite */}
                    <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.4 }}
                        className="flex flex-col items-center relative"
                    >
                        {/* Shadow */}
                        <div className="absolute -bottom-2 w-32 h-4 bg-black/40 rounded-[100%] blur-sm transform scale-x-150" />
                        <PixelAvatar type="player" scale={2.5} />
                    </motion.div>

                    {/* Boss Sprite */}
                    <motion.div
                        key={level.id}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ type: "spring", bounce: 0.4, delay: 0.2 }}
                        className="flex flex-col items-center relative"
                    >
                        {/* Shadow */}
                        <div className="absolute -bottom-2 w-32 h-4 bg-black/40 rounded-[100%] blur-sm transform scale-x-150" />
                        <div className=""> {/* Standard container */}
                            <PixelAvatar type="boss" bossId={level.id} scale={2.5} />
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="flex justify-between items-center mt-3 px-2">
                <div className="text-[10px] font-['Press_Start_2P'] text-slate-500 uppercase tracking-widest">
                    LOCATION: {level.biome}
                </div>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse delay-75" />
                    <div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse delay-150" />
                </div>
            </div>

        </div>
    );
};
