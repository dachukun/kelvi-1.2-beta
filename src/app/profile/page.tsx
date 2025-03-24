'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { FiSun, FiMoon } from 'react-icons/fi';
import { supabase } from '@/utils/supabase';
import BottomNav from '../dashboard/components/BottomNav';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen flowing-background flex items-center justify-center">
        <div className="card p-8">Loading...</div>
      </main>
    );
  }

  const getInitial = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <main className="min-h-screen flowing-background p-4 pb-20 md:p-8 md:pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Theme Toggle */}
        <div className="card flex items-center justify-between p-4">
          <span className="text-gray-600">Switch Appearance</span>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-golden-light/10 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <FiMoon size={24} /> : <FiSun size={24} />}
          </button>
        </div>

        {/* Profile Header with Avatar */}
        <div className="card flex flex-col items-center p-8">
          <div className="w-24 h-24 rounded-full bg-golden-gradient flex items-center justify-center mb-4 transform hover:scale-105 transition-transform">
            <span className="text-4xl font-bold text-white">
              {getInitial(user?.user_metadata?.name || '')}
            </span>
          </div>
          <h1 className="text-3xl font-bold bg-golden-gradient text-transparent bg-clip-text">
            {user?.user_metadata?.name || 'Student'}
          </h1>
        </div>

        {/* Student Information Card */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Student Information</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">School:</span>
              <span>{user?.user_metadata?.school || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Achievements Card */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Streak Achievement */}
            <div className="p-4 rounded-lg border border-golden-light hover:bg-golden-light/10 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-golden-gradient flex items-center justify-center">
                  <span className="text-2xl">🔥</span>
                </div>
                <div>
                  <h3 className="font-semibold">Current Streak</h3>
                  <p className="text-2xl font-bold">{user?.user_metadata?.streak || 0} days</p>
                </div>
              </div>
            </div>
            {/* Questions Answered Achievement */}
            <div className="p-4 rounded-lg border border-golden-light hover:bg-golden-light/10 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-golden-gradient flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <div>
                  <h3 className="font-semibold">Questions Answered</h3>
                  <p className="text-2xl font-bold">{user?.user_metadata?.shown_questions?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flowing-line" style={{ top: '15%', right: '10%' }} />
      <div className="flowing-line" style={{ bottom: '20%', left: '10%', animationDelay: '1s' }} />
      <BottomNav />
    </main>
  );
}