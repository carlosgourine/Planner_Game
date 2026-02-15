import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { levels } from '../data/levels';

export interface Goal {
    id: string;
    title: string;
    urgency: number; // 1-5
    difficulty: number; // 1-5
    completed: boolean;
    timeTaken?: number; // in minutes
}

interface GameState {
    currentLevelId: number;
    bossHp: number;
    goals: Goal[];
    day: number;
    gameStatus: 'playing' | 'won_level' | 'lost_level' | 'game_won';

    // Fighting Animation State
    isAttacking: boolean;
    wolfStatus: 'idle' | 'hurt';

    // Actions
    addGoal: (goal: Omit<Goal, 'id' | 'completed'>) => void;
    toggleGoal: (id: string, completed: boolean) => void;
    endDay: () => void;
    nextLevel: () => void;
    resetGame: () => void;
    deleteGoal: (id: string) => void;
    triggerAttack: () => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            currentLevelId: 1,
            bossHp: levels[0].maxHp,
            goals: [],
            day: 1,
            gameStatus: 'playing',

            // Animation State Initial Values
            isAttacking: false,
            wolfStatus: 'idle',

            addGoal: (goalData) => set((state) => ({
                goals: [...state.goals, { ...goalData, id: crypto.randomUUID(), completed: false }]
            })),

            toggleGoal: (id, completed) => set((state) => {
                const goal = state.goals.find(g => g.id === id);
                if (!goal) return state;

                let damage = 0;
                if (completed && !goal.completed) {
                    // Calculate productivity/damage
                    // Base Damage + (Difficulty * Urgency)
                    damage = (goal.difficulty * goal.urgency) + 5;
                } else if (!completed && goal.completed) {
                    // Revert damage if user unchecks
                    damage = -((goal.difficulty * goal.urgency) + 5);
                }

                const newHp = Math.max(0, state.bossHp - damage);

                // Check for win
                let newStatus: GameState['gameStatus'] = state.gameStatus;
                if (newHp === 0 && state.gameStatus === 'playing') {
                    newStatus = 'won_level';
                } else if (newHp > 0 && state.gameStatus === 'won_level') {
                    newStatus = 'playing';
                }

                return {
                    goals: state.goals.map(g => g.id === id ? { ...g, completed } : g),
                    bossHp: newHp,
                    gameStatus: newStatus
                };
            }),

            deleteGoal: (id) => set((state) => ({
                goals: state.goals.filter(g => g.id !== id)
            })),

            triggerAttack: () => {
                // 1. Start Cowboy Attack Sequence
                set({ isAttacking: true });

                // 2. Impact Point (~250ms in): Wolf gets hurt
                setTimeout(() => {
                    set({ wolfStatus: 'hurt' });
                }, 250);

                // 3. Attack Ends (400ms): Cowboy goes back to idle
                setTimeout(() => {
                    set({ isAttacking: false });
                }, 400);

                // 4. Recovery Ends (~550ms): Wolf goes back to idle
                setTimeout(() => {
                    set({ wolfStatus: 'idle' });
                }, 550);
            },

            endDay: () => set((state) => {
                if (state.bossHp <= 0) {
                    return state;
                } else {
                    return {
                        gameStatus: 'playing',
                        goals: [], // Fresh start for the new day
                        bossHp: levels[0].maxHp, // Reset Boss HP
                        day: state.day + 1
                    };
                }
            }),

            nextLevel: () => set(() => {
                return { gameStatus: 'game_won' };
            }),

            resetGame: () => set({
                currentLevelId: 1,
                bossHp: levels[0].maxHp,
                goals: [],
                day: 1,
                gameStatus: 'playing'
            }),
        }),
        {
            name: 'dopamine-planner-storage',
        }
    )
);
