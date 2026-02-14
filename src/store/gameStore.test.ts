// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './gameStore';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value.toString();
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

describe('useGameStore', () => {
    beforeEach(() => {
        useGameStore.getState().resetGame();
        localStorageMock.clear();
    });

    it('addGoal creates a goal correctly', () => {
        useGameStore.getState().addGoal({
            title: 'New Goal',
            urgency: 5,
            difficulty: 5,
        });

        const goals = useGameStore.getState().goals;
        expect(goals).toHaveLength(1);
        expect(goals[0].title).toBe('New Goal');
        expect(goals[0].urgency).toBe(5);
        expect(goals[0].difficulty).toBe(5);
        expect(goals[0].completed).toBe(false);
    });

    it('toggleGoal applies damage when completed', () => {
        useGameStore.getState().addGoal({
            title: 'Boss Killer',
            urgency: 5,
            difficulty: 5,
        });

        const initialHp = useGameStore.getState().bossHp;
        const goalId = useGameStore.getState().goals[0].id;
        const expectedDamage = (5 * 5) + 5; // 30 damage

        useGameStore.getState().toggleGoal(goalId, true);

        const newHp = useGameStore.getState().bossHp;
        expect(newHp).toBe(initialHp - expectedDamage);
        expect(useGameStore.getState().goals[0].completed).toBe(true);
    });

    it('toggleGoal reverts damage when uncompleted', () => {
        useGameStore.getState().addGoal({
            title: 'Healer',
            urgency: 5,
            difficulty: 5,
        });

        const goalId = useGameStore.getState().goals[0].id;
        const initialHp = useGameStore.getState().bossHp;

        // Complete first
        useGameStore.getState().toggleGoal(goalId, true);

        // Uncomplete
        useGameStore.getState().toggleGoal(goalId, false);

        const finalHp = useGameStore.getState().bossHp;
        expect(finalHp).toBe(initialHp); // Should revert
        expect(useGameStore.getState().goals[0].completed).toBe(false);
    });

    it('level up when boss HP reaches 0', () => {
        // Set boss HP to something small for easy kill
        useGameStore.setState({ bossHp: 10 });

        useGameStore.getState().addGoal({
            title: 'Final Blow',
            urgency: 5, // 25 dmg
            difficulty: 5 // + 5 = 30 dmg
        });

        const goalId = useGameStore.getState().goals[0].id;
        useGameStore.getState().toggleGoal(goalId, true);

        expect(useGameStore.getState().bossHp).toBe(0);
        expect(useGameStore.getState().gameStatus).toBe('won_level');
    });

    it('nextLevel advances the game correctly', () => {
        useGameStore.setState({ currentLevelId: 1, bossHp: 0, gameStatus: 'won_level', day: 1 });

        useGameStore.getState().nextLevel();

        expect(useGameStore.getState().currentLevelId).toBe(2);
        expect(useGameStore.getState().bossHp).toBeGreaterThan(0); // Should be reset for new level
        expect(useGameStore.getState().gameStatus).toBe('playing');
        expect(useGameStore.getState().day).toBe(2);
        expect(useGameStore.getState().goals).toHaveLength(0); // Should clear goals
    });

    it('endDay fails level if boss alive', () => {
        useGameStore.setState({ bossHp: 50, day: 1 });

        useGameStore.getState().endDay();

        expect(useGameStore.getState().gameStatus).toBe('lost_level');
        // Expect next day but same level
        expect(useGameStore.getState().day).toBe(2);
        expect(useGameStore.getState().bossHp).toBe(50); // Reset HP (or maintain? logic says reset for next attempt in my store implementation)
        // Wait, my implementation resets HP. Let's verify that.
        /*
          bossHp: levels[state.currentLevelId - 1].maxHp, // Reset Boss HP
          day: state.day + 1
        */
    });
});
