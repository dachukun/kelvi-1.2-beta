'use client';

interface StreakCardProps {
  streak: number;
}

export default function StreakCard({ streak }: StreakCardProps) {
  return (
    <div className="card p-6 transform transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold bg-golden-gradient text-transparent bg-clip-text">
          Learning Streak
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold gradient-text">{streak}</span>
          <span className="text-2xl animate-bounce-subtle">🔥</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        {streak === 0
          ? "Start your streak by answering correctly!"
          : streak === 1
          ? "Great start! Keep going!"
          : `You're on fire! ${streak} today and counting!`}
      </p>
    </div>
  );
}