'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

interface StreakCardProps {
  streak: number;
}

const DAYS = ['S', 'M', 'T', 'W', 'TR', 'F', 'ST'];

export default function StreakCard({ streak }: StreakCardProps) {
  const [weeklyStreak, setWeeklyStreak] = useState<boolean[]>(Array(7).fill(false));

  useEffect(() => {
    fetchWeeklyStreak();
  }, [streak]); // Refetch when streak changes

  const fetchWeeklyStreak = async () => {
    try {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Get Sunday

      const { data: streakData, error } = await supabase
        .from('weekly_streaks')
        .select('streak_date, has_streak')
        .gte('streak_date', startOfWeek.toISOString().split('T')[0])
        .lte('streak_date', today.toISOString().split('T')[0])
        .order('streak_date', { ascending: true });

      if (error) throw error;

      const weekStreak = Array(7).fill(false);
      streakData?.forEach(record => {
        const date = new Date(record.streak_date);
        const dayIndex = date.getDay();
        weekStreak[dayIndex] = record.has_streak;
      });

      setWeeklyStreak(weekStreak);
    } catch (error) {
      console.error('Error fetching weekly streak:', error);
    }
  };

  useEffect(() => {
    const updateDailyStreak = async () => {
      if (streak > 0) {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        try {
          await supabase
            .from('weekly_streaks')
            .upsert({
              streak_date: todayStr,
              has_streak: true
            }, {
              onConflict: 'user_id,streak_date'
            });

          await fetchWeeklyStreak(); // Refresh the streak display
        } catch (error) {
          console.error('Error updating daily streak:', error);
        }
      }
    };

    updateDailyStreak();
  }, [streak]); // Update when streak changes


  return (
    <div className="card p-6 transform transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold bg-indigo-gradient text-transparent bg-clip-text">Learning Streak</h2>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold gradient-text">{streak}</span>
          <span className="text-2xl animate-bounce-subtle">🔥</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        {DAYS.map((day, index) => (
          <div key={day} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${weeklyStreak[index] ? 'bg-indigo-gradient text-white' : 'border-2 border-indigo-light text-gray-600'}`}
            >
              <span className="text-xs font-medium">{day}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-600">
        {streak === 0
          ? "Start your streak by answering correctly!"
          : streak === 1
          ? "Great start! Keep going!"
          : `You're on fire! ${streak} days and counting!`}
      </p>
    </div>
  );
}