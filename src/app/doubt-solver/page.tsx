'use client';

import { useState } from 'react';
import FloatingMenu from '../dashboard/components/BottomNav';

export default function DoubtSolver() {
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    question: '',
    image: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [solution, setSolution] = useState('');

  const grades = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  const subjects = ['Mathematics', 'Science', 'English', 'Social Studies'];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSolution('');

    if (!formData.grade || !formData.subject) {
      setError('Please select both grade and subject');
      setLoading(false);
      return;
    }

    if (!formData.question.trim() && !formData.image) {
      setError('Please either enter a question or upload an image');
      setLoading(false);
      return;
    }

    try {
      // Here you would typically send the question and image to your backend
      // For now, we'll just simulate a processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSolution('This is a sample solution. In the actual implementation, this would be replaced with the AI-generated solution.');
    } catch (err: any) {
      setError('Failed to process your doubt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flowing-background p-4 pb-20 md:p-8 md:pb-24">
      <div className="max-w-4xl mx-auto space-y-6 text-center">
        <div className="card">
          <h1 className="text-3xl font-bold bg-indigo-gradient text-transparent bg-clip-text mb-2">
            Doubt Solver
          </h1>
          <p className="ka-text-box text-sm text-center bg-indigo-gradient text-transparent bg-clip-text">
            Powered by Ka1.2 reasoner
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <p className="text-sm text-gray-600 mb-4">Either describe question or upload PDF only</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1">
                  Grade
                </label>
                <select
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Select Grade</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
                Your Question (Optional)
              </label>
              <textarea
                id="question"
                value={formData.question}
                onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                className="input-field min-h-[100px]"
                placeholder="Type your question here..."
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
                        accept="application/pdf"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF files up to 10MB
                  </p>
                  {formData.image && (
                    <p className="text-sm text-indigo-light">
                      Selected: {formData.image.name}
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
              {loading ? 'Processing...' : 'Solve Doubt'}
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
      <FloatingMenu />
    </main>
  );
}