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

    // Actions
    addGoal: (goal: Omit<Goal, 'id' | 'completed'>) => void;
    toggleGoal: (id: string, completed: boolean) => void;
    endDay: () => void;
    nextLevel: () => void;
    resetGame: () => void;
    deleteGoal: (id: string) => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            currentLevelId: 1,
            bossHp: levels[0].maxHp,
            goals: [],
            day: 1,
            gameStatus: 'playing',

            addGoal: (goalData) => set((state) => ({
                goals: [...state.goals, { ...goalData, id: crypto.randomUUID(), completed: false }]
            })),

            toggleGoal: (id, completed) => set((state) => {
                const goal = state.goals.find(g => g.id === id);
                if (!goal) return state;

                // Calculate damage strictly on completion toggle
                // If un-completing, we heal the boss? For now, let's keep it simple: 
                // Damage is applied when 'completing'. 
                // Ideally, damage should be separate, but let's simplify:
                // completion logic handles the damage calculation.

                let damage = 0;
                if (completed && !goal.completed) {
                    // Calculate productivity/damage
                    // Base Damage + (Difficulty * Urgency)
                    // Example: 5 Diff * 5 Urgency = 25 damage.
                    damage = (goal.difficulty * goal.urgency) + 5;
                } else if (!completed && goal.completed) {
                    // Revert damage if user unchecks (accidental click)
                    damage = -((goal.difficulty * goal.urgency) + 5);
                }

                const newHp = Math.max(0, state.bossHp - damage); // Don't heal above max? Or allow undo?
                // Let's just clamp to 0 minimum.

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

            endDay: () => set((state) => {
                if (state.bossHp <= 0) {
                    // Already won, just moving to next day shouldn't really change much unless we want to force next level?
                    // "Next Level" action handles the actual progression.
                    // But if end day is pressed while won, maybe nothing happens or we force next level.
                    return state;
                } else {
                    // Valid loss condition
                    return {
                        gameStatus: 'playing',
                        goals: [], // Fresh start for the new day
                        bossHp: levels[0].maxHp, // Reset Boss HP
                        day: state.day + 1
                    };
                }
            }),

            nextLevel: () => set(() => {
                // Since we only have one boss, "Winning" the level wins the whole game
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
