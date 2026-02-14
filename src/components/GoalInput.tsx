import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Plus, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const GoalInput: React.FC = () => {
    const addGoal = useGameStore(state => state.addGoal);
    const [title, setTitle] = useState('');
    const [urgency, setUrgency] = useState(3);
    const [difficulty, setDifficulty] = useState(3);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        addGoal({
            title,
            urgency,
            difficulty,
            timeTaken: 0
        });
        setTitle('');
        setUrgency(3);
        setDifficulty(3);
    };

    const renderStars = (value: number, setValue: (val: number) => void, label: string, color: string) => (
        <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wider text-gray-400 font-bold">{label}</span>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setValue(star)}
                        className={`transition-colors ${star <= value ? color : 'text-gray-700'}`}
                    >
                        <Star size={16} fill={star <= value ? 'currentColor' : 'none'} />
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="glass-panel p-4 rounded-xl flex flex-col gap-4 w-full max-w-md mx-auto"
        >
            <div className="flex flex-col gap-2">
                <label htmlFor="goal-title" className="sr-only">New Goal</label>
                <input
                    id="goal-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a new quest..."
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors"
                />
            </div>

            <div className="flex justify-between items-center">
                {renderStars(urgency, setUrgency, "Urgency", "text-red-400")}
                {renderStars(difficulty, setDifficulty, "Difficulty", "text-purple-400")}

                <button
                    type="submit"
                    className="bg-yellow-600 hover:bg-yellow-500 text-white p-3 rounded-full shadow-lg shadow-yellow-900/20 transition-all hover:scale-105 active:scale-95"
                    disabled={!title.trim()}
                >
                    <Plus size={20} />
                </button>
            </div>
        </motion.form>
    );
};
