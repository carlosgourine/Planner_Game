import React from 'react';
import { useGameStore } from '../store/gameStore';
import type { Goal } from '../store/gameStore';
import { Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export const GoalList: React.FC = () => {
    const { goals, toggleGoal, deleteGoal } = useGameStore();

    const handleToggle = (id: string, currentStatus: boolean) => {
        toggleGoal(id, !currentStatus);
    };

    if (goals.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-10 italic">
                No quests active. Prepare for battle...
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto mt-6 flex flex-col gap-3">
            <AnimatePresence>
                {goals.map((goal) => (
                    <GoalItem
                        key={goal.id}
                        goal={goal}
                        onToggle={() => handleToggle(goal.id, goal.completed)}
                        onDelete={() => deleteGoal(goal.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

const GoalItem: React.FC<{
    goal: Goal;
    onToggle: () => void;
    onDelete: () => void;
}> = ({ goal, onToggle, onDelete }) => {
    // Calculate potential damage for display
    const damage = (goal.difficulty * goal.urgency) + 5;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={clsx(
                "relative group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer select-none",
                goal.completed
                    ? "bg-green-900/20 border-green-500/30 opacity-60"
                    : "glass-panel hover:bg-white/5 active:scale-[0.98]"
            )}
            onClick={onToggle}
        >
            <div className="flex items-start gap-3">
                <div className={clsx(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors mt-1",
                    goal.completed ? "bg-green-500 border-green-500" : "border-gray-500 group-hover:border-yellow-500"
                )}>
                    {goal.completed && <Check size={14} className="text-black" />}
                </div>

                <div className="flex flex-col">
                    <span className={clsx(
                        "font-medium transition-all text-lg",
                        goal.completed ? "line-through text-gray-400" : "text-gray-100"
                    )}>
                        {goal.title}
                    </span>
                    <div className="flex gap-2 text-xs text-gray-400">
                        <span className="text-red-300">⚔️ {damage} DMG</span>
                        <span>•</span>
                        <span className="text-purple-300">Diff: {goal.difficulty}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 transition-opacity"
            >
                <Trash2 size={16} />
            </button>
        </motion.div>
    );
};
