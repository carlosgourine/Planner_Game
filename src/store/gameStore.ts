import { create } from "zustand";
import { persist } from "zustand/middleware";
import { levels } from "../data/levels";

export interface Goal {
    id: string;
    title: string;
    urgency: number; // 1-5
    difficulty: number; // 1-5
    completed: boolean;
    timeTaken?: number; // minutes
}

interface GameState {
    currentLevelId: number;
    bossHp: number;
    goals: Goal[];
    day: number;
    gameStatus: "playing" | "won_level" | "lost_level" | "game_won";

    // Animation state
    isAttacking: boolean;
    wolfStatus: "idle" | "hurt";
    isShaking: boolean;

    // Actions
    addGoal: (goal: Omit<Goal, "id" | "completed">) => void;
    toggleGoal: (id: string, completed: boolean) => void;
    deleteGoal: (id: string) => void;
    triggerAttack: () => void;

    endDay: () => void;
    nextLevel: () => void;
    resetGame: () => void;
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => {
            const startLevelId = 1;
            const startLevel = levels.find((l) => l.id === startLevelId) || levels[0];

            // Timer cleanup to prevent stacking
            let timers: ReturnType<typeof setTimeout>[] = [];
            const clearTimers = () => {
                timers.forEach(clearTimeout);
                timers = [];
            };

            return {
                currentLevelId: startLevelId,
                bossHp: startLevel.maxHp,
                goals: [],
                day: 1,
                gameStatus: "playing",

                isAttacking: false,
                wolfStatus: "idle",
                isShaking: false,

                addGoal: (goalData) =>
                    set((state) => ({
                        goals: [
                            ...state.goals,
                            { ...goalData, id: crypto.randomUUID(), completed: false },
                        ],
                    })),

                toggleGoal: (id, completed) =>
                    set((state) => {
                        const goal = state.goals.find((g) => g.id === id);
                        if (!goal) return state;

                        const level = levels.find((l) => l.id === state.currentLevelId) || levels[0];
                        const maxBossHp = level.maxHp;

                        let damage = 0;

                        // Only deal damage when going from unchecked -> checked
                        if (completed && !goal.completed) {
                            damage = goal.difficulty * goal.urgency + 5;
                            // Trigger attack (microtask so it happens after state updates)
                            queueMicrotask(() => get().triggerAttack());
                        }

                        // If user unchecks, restore HP (reverse damage)
                        if (!completed && goal.completed) {
                            damage = -(goal.difficulty * goal.urgency + 5);
                        }

                        const newHp = clamp(state.bossHp - damage, 0, maxBossHp);

                        let newStatus: GameState["gameStatus"] = state.gameStatus;
                        if (newHp === 0 && state.gameStatus === "playing") newStatus = "won_level";
                        if (newHp > 0 && state.gameStatus === "won_level") newStatus = "playing";

                        return {
                            goals: state.goals.map((g) => (g.id === id ? { ...g, completed } : g)),
                            bossHp: newHp,
                            gameStatus: newStatus,
                        };
                    }),

                // OPTIONAL FIX: if user deletes a completed goal, restore HP properly
                deleteGoal: (id) =>
                    set((state) => {
                        const goal = state.goals.find((g) => g.id === id);
                        if (!goal) return state;

                        const level = levels.find((l) => l.id === state.currentLevelId) || levels[0];
                        const maxBossHp = level.maxHp;

                        let bossHp = state.bossHp;

                        if (goal.completed) {
                            const restore = goal.difficulty * goal.urgency + 5;
                            bossHp = clamp(state.bossHp + restore, 0, maxBossHp);
                        }

                        return {
                            goals: state.goals.filter((g) => g.id !== id),
                            bossHp,
                            gameStatus: bossHp === 0 ? "won_level" : "playing",
                        };
                    }),

                triggerAttack: () => {
                    // Match index.css durations
                    const ATTACK_TOTAL = 2600;   // matches 2.6s attack
                    const IMPACT_AT = 1500;      // when kick looks like it hits
                    const SHAKE_LEN = 250;
                    const HURT_LEN = 1600;       // matches wolf hurt duration (1.6s)

                    // Clear existing timers to prevent movement glitching
                    clearTimers();

                    set({ isAttacking: true });

                    timers.push(setTimeout(() => {
                        set({ wolfStatus: "hurt", isShaking: true });
                    }, IMPACT_AT));

                    timers.push(setTimeout(() => {
                        set({ isShaking: false });
                    }, IMPACT_AT + SHAKE_LEN));

                    timers.push(setTimeout(() => {
                        set({ isAttacking: false });
                    }, ATTACK_TOTAL));

                    timers.push(setTimeout(() => {
                        set({ wolfStatus: "idle" });
                    }, IMPACT_AT + HURT_LEN));
                },

                endDay: () =>
                    set((state) => {
                        // if already won, don't reset
                        if (state.bossHp <= 0) return state;

                        const level = levels.find((l) => l.id === state.currentLevelId) || levels[0];

                        return {
                            goals: [],
                            bossHp: level.maxHp,
                            day: state.day + 1,
                            gameStatus: "playing",
                            isAttacking: false,
                            wolfStatus: "idle",
                            isShaking: false,
                        };
                    }),

                nextLevel: () =>
                    set((state) => {
                        const nextId = state.currentLevelId + 1;
                        const next = levels.find((l) => l.id === nextId);

                        // No next level => game won
                        if (!next) {
                            return { gameStatus: "game_won" };
                        }

                        return {
                            currentLevelId: nextId,
                            bossHp: next.maxHp,
                            goals: [],
                            day: 1,
                            gameStatus: "playing",
                            isAttacking: false,
                            wolfStatus: "idle",
                            isShaking: false,
                        };
                    }),

                resetGame: () => {
                    const first = levels.find((l) => l.id === 1) || levels[0];
                    set({
                        currentLevelId: 1,
                        bossHp: first.maxHp,
                        goals: [],
                        day: 1,
                        gameStatus: "playing",
                        isAttacking: false,
                        wolfStatus: "idle",
                        isShaking: false,
                    });
                },
            };
        },
        { name: "dopamine-planner-storage" }
    )
);
