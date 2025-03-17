'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import StreakCard from './components/StreakCard';
import BottomNav from './components/BottomNav';

// Function to decode HTML entities
const decodeHtmlEntities = (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [quote, setQuote] = useState('');
  const [streak, setStreak] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shownQuestions, setShownQuestions] = useState<string[]>([]);
  const [fetchingQuestion, setFetchingQuestion] = useState(false);

  useEffect(() => {
    fetchUserData();
    generateQuote();
    generateNewQuiz();
  }, []);

  const fetchUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      // Check if it's a new day and reset streak if needed
      const lastUpdate = user.user_metadata?.lastStreakUpdate;
      const today = new Date().toDateString();
      
      if (lastUpdate && lastUpdate !== today) {
        // Reset streak as it's a new day
        await supabase.auth.updateUser({
          data: {
            streak: 0,
            lastStreakUpdate: today
          }
        });
        setStreak(0);
      } else {
        // Set streak from metadata
        setStreak(user.user_metadata?.streak || 0);
      }
      
      setShownQuestions(user.user_metadata?.shown_questions || []);
    }
    setLoading(false);
  };

  const generateQuote = () => {
    const quotes = [
      "Education is not preparation for life; education is life itself.",
      "The more that you read, the more things you will know.",
      "Learning is a treasure that will follow its owner everywhere.",
      "Knowledge is power. Information is liberating.",
      "The beautiful thing about learning is that no one can take it away from you."
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  };

  const generateNewQuiz = async () => {
    setFetchingQuestion(true);
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
      const data = await response.json();
      
      if (data.response_code !== 0 || !data.results?.length) {
        throw new Error('Failed to fetch question');
      }

      const result = data.results[0];
      const decodedQuestion = decodeHtmlEntities(result.question);
      const decodedOptions = [
        ...result.incorrect_answers.map(decodeHtmlEntities),
        decodeHtmlEntities(result.correct_answer)
      ].sort(() => Math.random() - 0.5);
      
      const quiz = {
        category: decodeHtmlEntities(result.category),
        question: decodedQuestion,
        options: decodedOptions,
        correctAnswer: decodedOptions.indexOf(decodeHtmlEntities(result.correct_answer))
      };

      // Generate a unique ID for the question based on its content
      const questionId = btoa(decodedQuestion).slice(0, 20);

      // If we've shown all questions in our tracking, reset the tracking
      if (shownQuestions.length >= 100) {
        setShownQuestions([questionId]);
        await supabase.auth.updateUser({
          data: { shown_questions: [questionId] }
        });
      } else if (!shownQuestions.includes(questionId)) {
        // Only add to shown questions if it's not already there
        const newShownQuestions = [...shownQuestions, questionId];
        setShownQuestions(newShownQuestions);
        await supabase.auth.updateUser({
          data: { shown_questions: newShownQuestions }
        });
      }

      setCurrentQuiz(quiz);
    } catch (error) {
      console.error('Failed to fetch new question:', error);
      // If API fails, generate a backup question
      const backupQuiz = {
        category: 'General Knowledge',
        question: 'What is the capital of Japan?',
        options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'],
        correctAnswer: 2
      };
      setCurrentQuiz(backupQuiz);
    } finally {
      setFetchingQuestion(false);
    }
    
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  const handleAnswerSelect = async (index: number) => {
    setSelectedAnswer(index);
    const correct = index === currentQuiz.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      // Update user streak in database
      await supabase.auth.updateUser({
        data: {
          streak: newStreak,
          lastStreakUpdate: new Date().toDateString()
        }
      });
    } else {
      setStreak(0);
      // Reset streak in database
      await supabase.auth.updateUser({
        data: {
          streak: 0,
          lastStreakUpdate: new Date().toDateString()
        }
      });
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flowing-background flex items-center justify-center">
        <div className="card p-8">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flowing-background p-4 pb-20 md:p-8 md:pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Welcome Section */}
        <div className="card">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold bg-golden-gradient text-transparent bg-clip-text">
              Welcome back, {user?.user_metadata?.name || 'Student'}!
            </h1>
            <div className="w-16 h-16 rounded-full border-2 border-golden-light/30 flex items-center justify-center bg-gradient-to-br from-golden-light/10 to-golden-dark/10">
              <span className="text-2xl font-bold bg-golden-gradient text-transparent bg-clip-text">
                {(user?.user_metadata?.name || 'S').charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Quote Section */}
        <div className="card">
          <p className="text-lg italic text-gray-600">"{quote}"</p>
        </div>

        {/* Streak Card */}
        <StreakCard streak={streak} />

        {/* Quiz Section */}
        <div className="card space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Daily Quiz</h2>
            <span className="text-sm text-gray-500">{currentQuiz?.category}</span>
          </div>
          
          <p className="text-lg">{currentQuiz?.question}</p>
          
          <div className="grid gap-3">
            {currentQuiz?.options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={selectedAnswer !== null}
                className={`p-3 rounded-lg border transition-all ${
                  selectedAnswer === null
                    ? 'hover:border-golden-light hover:bg-golden-light/10'
                    : selectedAnswer === index
                    ? isCorrect
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : index === currentQuiz.correctAnswer && selectedAnswer !== null
                    ? 'bg-green-100 border-green-500'
                    : 'border-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {selectedAnswer !== null && (
            <div className="flex justify-between items-center mt-4">
              <p className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                {isCorrect ? 'Correct! 🎉' : 'Try again! 💪'}
              </p>
              <button
                onClick={generateNewQuiz}
                className="golden-button"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flowing-line" style={{ top: '15%', right: '10%' }} />
      <div className="flowing-line" style={{ bottom: '20%', left: '10%', animationDelay: '1s' }} />
      <BottomNav />
    </main>
  );
}