import React from "react";
import { useGameStore } from "../store/gameStore";
import { PixelAvatar } from "./PixelAvatar";
import { levels } from "../data/levels";

export const BossArena: React.FC = () => {
    const { bossHp, currentLevelId, isAttacking, wolfStatus, isShaking, attackSeq } = useGameStore();

    const level = levels.find((l) => l.id === currentLevelId) || levels[0];
    const maxBossHp = level.maxHp;
    const healthPercentage = (bossHp / maxBossHp) * 100;

    // Tune these if you want them closer/farther
    const LEFT_X = "30%";
    const RIGHT_X = "70%";
    const GROUND_Y = "8%";

    return (
        <div
            className={[
                "relative w-full max-w-5xl mx-auto overflow-hidden rounded-xl shadow-2xl border-4 border-slate-800 bg-black",
                "aspect-video",
                isShaking ? "animate-shake" : "",
            ].join(" ")}
        >
            {/* Background */}
            <img
                src="/background.jpg"
                alt="Fight Arena"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ imageRendering: "pixelated" }}
            />

            {/* HUD */}
            <div className="absolute top-0 left-0 right-0 p-4 z-20">
                <div className="flex justify-between mb-2 px-2 font-['Press_Start_2P'] text-xs text-white text-shadow-lg">
                    <span>COWBOY</span>
                    <span>WOLF</span>
                </div>

                <div className="w-full h-6 bg-slate-900 border-2 border-slate-700 relative shadow-inner">
                    <div
                        className="h-full bg-gradient-to-r from-red-500 to-red-700 transition-all duration-300 ease-out origin-left"
                        style={{ width: `${healthPercentage}%` }}
                    />
                </div>
            </div>

            {/* Fighters */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Cowboy */}
                <div
                    className="absolute -translate-x-1/2"
                    style={{
                        left: LEFT_X,
                        bottom: GROUND_Y,
                    } as React.CSSProperties}
                >
                    <div className="relative">
                        <PixelAvatar
                            key={`cowboy-${attackSeq}-${isAttacking ? "atk" : "idle"}`}
                            type="cowboy"
                            isAttacking={isAttacking}
                            className="w-[clamp(220px,26vw,360px)] h-[clamp(220px,26vw,360px)] relative z-10"
                        />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black/50 rounded-[100%] blur-sm z-0" />
                    </div>
                </div>

                {/* Wolf */}
                <div
                    className="absolute -translate-x-1/2"
                    style={{
                        left: RIGHT_X,
                        bottom: GROUND_Y,
                    } as React.CSSProperties}
                >
                    <div className="relative">
                        <div className="sprite-flip">
                            <PixelAvatar
                                key={`wolf-${attackSeq}-${wolfStatus}`}
                                type="wolf"
                                isHurt={wolfStatus === "hurt"}
                                className="w-[clamp(220px,26vw,360px)] h-[clamp(220px,26vw,360px)] relative z-10"
                            />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black/50 rounded-[100%] blur-sm z-0" />
                    </div>
                </div>
            </div>
        </div>
    );
};
