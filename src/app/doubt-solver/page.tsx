'use client';

import { useState } from 'react';
import OpenAI from 'openai';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import FloatingMenu from '../dashboard/components/BottomNav';

export default function DoubtSolver() {
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    question: '',
    image: null as File | null
  });

  const openai = new OpenAI({
    baseURL: process.env.NEXT_PUBLIC_OPENAI_BASE_URL || "https://openrouter.ai/api/v1",
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_OPENAI_HTTP_REFERER || "https://kelvi.ai",
      "X-Title": process.env.NEXT_PUBLIC_OPENAI_X_TITLE || "Kelvi AI",
    },
    dangerouslyAllowBrowser: true
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
      let prompt = `As a ${formData.subject} teacher for grade ${formData.grade}, please help solve this question:\n\n`;

      if (formData.question.trim()) {
        prompt += formData.question;
      }

      if (formData.image) {
        const reader = new FileReader();
        const imageData = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result);
          if (formData.image) {
            reader.readAsDataURL(formData.image);
          }
        });
        prompt += `\n\nImage content: ${imageData}`;
      }

      prompt += `\n\nPlease provide a detailed solution with the following guidelines:
1. Use LaTeX notation for mathematical expressions (e.g. $\\sin \\theta$, $\\frac{a}{b}$)
2. Break down the solution into clear steps
3. Include relevant formulas and explanations
4. If applicable, provide a diagram or visual explanation`;

      const completion = await openai.chat.completions.create({
        model: "deepseek/deepseek-r1-zero:free",
        messages: [
          {
            "role": "user",
            "content": prompt
          }
        ],
      });

      const solution = completion.choices[0].message.content;
      if (!solution) throw new Error('No solution generated');

      // Process the solution to render LaTeX expressions
      let processedSolution = solution;
      
      // Replace LaTeX delimiters with rendered math
      processedSolution = processedSolution.replace(/\$\$([^$]+)\$\$/g, (_, tex) => {
        try {
          return katex.renderToString(tex, { displayMode: true });
        } catch (err) {
          console.error('LaTeX Error:', err);
          return tex;
        }
      }).replace(/\$([^$]+)\$/g, (_, tex) => {
        try {
          return katex.renderToString(tex, { displayMode: false });
        } catch (err) {
          console.error('LaTeX Error:', err);
          return tex;
        }
      });

      setSolution(processedSolution);
    } catch (err: any) {
      console.error('API Error:', err);
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
            <p className="text-sm text-gray-600 mb-4">Either describe question or upload an image or PDF file</p>
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
                        accept="image/*,.pdf"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    Image files (PNG, JPEG, GIF) or PDF files up to 10MB
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
                <div className="text-gray-700 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: solution }} />
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