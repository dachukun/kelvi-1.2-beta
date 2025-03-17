'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

export default function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flowing-background flex items-center justify-center p-4">
      <Link href="/" className="absolute top-4 left-4 golden-button flex items-center gap-2 z-20">
        <span>←</span>
        <span>Back</span>
      </Link>
      <div className="card max-w-md w-full relative z-10">
        <h1 className="text-3xl font-bold text-center mb-8 bg-golden-gradient text-transparent bg-clip-text">
          Reset Password
        </h1>

        {success ? (
          <div className="text-center space-y-4">
            <p className="text-green-600">
              Password reset link has been sent to your email.
            </p>
            <Link href="/login" className="golden-button inline-block">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field"
                placeholder="your.email@school.edu"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="golden-button w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-golden-dark hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>

      <div className="flowing-line" style={{ top: '15%', right: '10%' }} />
      <div className="flowing-line" style={{ bottom: '20%', left: '10%', animationDelay: '1s' }} />
    </main>
  );
}