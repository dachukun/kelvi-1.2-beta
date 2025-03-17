'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import BottomNav from '../dashboard/components/BottomNav';

export default function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!formData.name || !formData.email || !formData.message) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err: any) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const faqs = [
    {
      question: 'How does the daily quiz work?',
      answer: 'The daily quiz presents you with a new question each day. Answer correctly to maintain your streak!'
    },
    {
      question: 'How do I track my progress?',
      answer: 'Your progress is tracked through your daily streak counter, which you can see on your dashboard.'
    },
    {
      question: 'Can I change my profile information?',
      answer: 'Yes! You can update your profile information in the Profile section.'
    },
    {
      question: 'What happens if I miss a day?',
      answer: 'If you miss a day, your streak will reset to zero. Try to maintain your streak by answering at least one question each day!'
    }
  ];

  return (
    <main className="min-h-screen flowing-background p-4 pb-20 md:p-8 md:pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="card">
          <h1 className="text-3xl font-bold bg-golden-gradient text-transparent bg-clip-text mb-4">
            Support
          </h1>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="input-field min-h-[100px]"
                placeholder="How can we help you?"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {success && (
              <p className="text-green-500 text-sm text-center">
                Message sent successfully! We'll get back to you soon.
              </p>
            )}

            <button
              type="submit"
              className="golden-button w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* FAQs Section */}
        <div className="card space-y-4">
          <h2 className="text-2xl font-semibold bg-golden-gradient text-transparent bg-clip-text">
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-golden-light/20 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-4 text-left flex justify-between items-center hover:bg-golden-light/10 transition-colors"
                >
                  <span className="font-medium">{faq.question}</span>
                  <span className="text-golden-dark">
                    {expandedFaq === index ? '−' : '+'}
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="p-4 pt-0 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Logout Section */}
        <div className="card text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">
            Sorry to see you go...
          </h2>
          <p className="text-gray-600">
            If you need to leave, you can safely log out below. We hope to see you again soon!
          </p>
          <button
            onClick={handleLogout}
            className="golden-button"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flowing-line" style={{ top: '15%', right: '10%' }} />
      <div className="flowing-line" style={{ bottom: '20%', left: '10%', animationDelay: '1s' }} />
      <BottomNav />
    </main>
  );
}