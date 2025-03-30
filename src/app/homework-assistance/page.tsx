'use client';

import { useState } from 'react';
import BottomNav from '../dashboard/components/BottomNav';

export default function HomeworkAssistance() {
  const [question, setQuestion] = useState('');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [solution, setSolution] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSolution('');

    if (!question.trim()) {
      setError('Please enter your question');
      setLoading(false);
      return;
    }

    if (!grade.trim()) {
      setError('Please select your grade');
      setLoading(false);
      return;
    }

    if (!subject.trim()) {
      setError('Please select your subject');
      setLoading(false);
      return;
    }

    try {
      // Here you would typically send the question, grade, subject and image to your backend
      // For now, we'll just simulate a processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSolution('This is a sample solution. In the actual implementation, this would be replaced with the AI-generated solution.');
    } catch (err: any) {
      setError('Failed to process your homework. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flowing-background p-4 pb-20 md:p-8 md:pb-24">
      <div className="max-w-4xl mx-auto space-y-6 text-center">
        <div className="card">
          <h1 className="text-3xl font-bold bg-indigo-gradient text-transparent bg-clip-text mb-2">
            Homework Assistance
          </h1>
          <p className="ka-text-box text-sm text-center bg-indigo-gradient text-transparent bg-clip-text">
            Powered by Ka1.2
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                Grade
              </label>
              <select
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select Grade</option>
                <option value="1">Grade 1</option>
                <option value="2">Grade 2</option>
                <option value="3">Grade 3</option>
                <option value="4">Grade 4</option>
                <option value="5">Grade 5</option>
                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                <option value="10">Grade 10</option>
                <option value="11">Grade 11</option>
                <option value="12">Grade 12</option>
              </select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select Subject</option>
                <option value="mathematics">Mathematics</option>
                <option value="physics">Physics</option>
                <option value="chemistry">Chemistry</option>
                <option value="biology">Biology</option>
                <option value="english">English</option>
                <option value="history">History</option>
                <option value="geography">Geography</option>
                <option value="computer_science">Computer Science</option>
              </select>
            </div>

            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                Your Question
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="input-field min-h-[100px]"
                placeholder="Type your homework question here..."
                required
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Upload Image (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-light transition-colors">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-light hover:text-indigo-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-light"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  {image && (
                    <p className="text-sm text-indigo-light">
                      Selected: {image.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="indigo-button w-full"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Get Help'}
            </button>
          </form>
        </div>

        {/* Solution Display Box */}
        {solution && (
          <div className="card">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold bg-indigo-gradient text-transparent bg-clip-text">Solution</h3>
              <div className="prose prose-indigo max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{solution}</p>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="card">
            <div className="p-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-light"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="card">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flowing-line" style={{ top: '15%', right: '10%' }} />
      <div className="flowing-line" style={{ bottom: '20%', left: '10%', animationDelay: '1s' }} />
      <BottomNav />
    </main>
  );
}