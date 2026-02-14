
import { useGameStore } from './store/gameStore';
import { GoalInput } from './components/GoalInput';
import { GoalList } from './components/GoalList';
import { BossArena } from './components/BossArena';
import { Moon, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { levels } from './data/levels';

function App() {
  const {
    gameStatus,
    bossHp,
    endDay,
    nextLevel,
    currentLevelId,
    day,
    resetGame
  } = useGameStore();

  const currentLevel = levels.find(l => l.id === currentLevelId) || levels[0];
  const isWin = bossHp <= 0;

  // Background style based on level color
  const bgStyle = {
    background: `linear-gradient(to bottom right, #0a0a0a, ${currentLevel.color.split(' ')[1].replace('to-', '')})`
  };

  return (
    <div className="h-screen text-white relative transition-colors duration-1000 overflow-y-auto pb-20">
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 opacity-40 transition-all duration-1000" style={bgStyle} />
      <div className="fixed inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

      <div className="relative z-10 container mx-auto px-4 py-8">

        {/* Header - now part of BossArena HUD mostly, simplifying */}
        <header className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 font-['Press_Start_2P'] shadow-lg">
              DOPAMINE PLANNER
            </span>
          </div>
          <div className="flex items-center gap-4 bg-black/50 px-4 py-2 rounded border-2 border-white/10 font-['Press_Start_2P'] text-[10px]">
            <span className="text-gray-300">DAY {day}</span>
            <span className="text-gray-600">|</span>
            <span className="text-yellow-500">LVL {currentLevelId}</span>
          </div>
        </header>

        <BossArena />

        <main className="max-w-2xl mx-auto relative z-20">
          <GoalInput />
          <div className="mt-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
            <GoalList />
          </div>
        </main>

        {/* Floating Action / Status Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/80 border-t-4 border-gray-800 z-50">
          <div className="max-w-md mx-auto flex justify-center">
            {isWin ? (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={nextLevel}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-green-900/50 flex items-center gap-2"
              >
                <span>VICTORY! Enter Next Level</span>
                <ArrowRight size={20} />
              </motion.button>
            ) : (
              <button
                onClick={endDay}
                className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium py-3 px-8 rounded-full border border-white/10 hover:border-white/20 transition-all flex items-center gap-2"
              >
                <Moon size={18} />
                <span>End Day (Risk Defeat)</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Overlays for Game Over / Win could go here */}
        <AnimatePresence>
          {gameStatus === 'game_won' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            >
              <div className="text-center max-w-lg">
                <h2 className="text-6xl font-black text-yellow-500 mb-4 animate-bounce">VICTORY!</h2>
                <p className="text-2xl text-gray-300 mb-8">You have conquered all 7 Kingdoms and mastered your productivity.</p>
                <button
                  onClick={resetGame}
                  className="bg-white text-black px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2 mx-auto"
                >
                  <RotateCcw size={20} />
                  Start New Journey
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default App;
