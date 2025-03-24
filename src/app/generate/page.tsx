'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../dashboard/components/BottomNav';

type Chapter = {
  name: string;
  questions: {
    marks: number;
    count: number;
  }[];
};

type FormData = {
  schoolName: string;
  board: string;
  grade: string;
  subject: string;
  chapters: Chapter[];
};

export default function Generate() {
  const [activeTab, setActiveTab] = useState('details');
  const [chapterInput, setChapterInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    schoolName: '',
    board: 'CBSE',
    grade: '',
    subject: '',
    chapters: []
  });

  const grades = ['6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  const subjects = ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'];

  const addChapter = () => {
    if (!chapterInput.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      chapters: [...prev.chapters, { name: chapterInput, questions: [] }]
    }));
    setChapterInput('');
  };

  const removeChapter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index)
    }));
  };

  const updateChapter = (index: number, name: string) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.map((chapter, i) => 
        i === index ? { ...chapter, name } : chapter
      )
    }));
  };

  const updateQuestionDistribution = (chapterIndex: number, marks: number, count: number) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.map((chapter, i) => {
        if (i !== chapterIndex) return chapter;
        
        const existingQuestion = chapter.questions.find(q => q.marks === marks);
        if (existingQuestion) {
          return {
            ...chapter,
            questions: chapter.questions.map(q =>
              q.marks === marks ? { ...q, count } : q
            )
          };
        } else {
          return {
            ...chapter,
            questions: [...chapter.questions, { marks, count }]
          };
        }
      })
    }));
  };

  const calculateTotalMarks = () => {
    return formData.chapters.reduce((total, chapter) => {
      return total + chapter.questions.reduce((chapterTotal, q) => 
        chapterTotal + (q.marks * q.count), 0);
    }, 0);
  };

  return (
    <main className="min-h-screen flowing-background p-4 pb-20 md:p-8 md:pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Tabs */}
        <div className="card p-4">
          <div className="flex space-x-4 border-b border-golden-light/20 pb-4">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'details'
                  ? 'bg-golden-gradient text-white'
                  : 'hover:bg-golden-light/10'
              }`}
            >
              Paper Details
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'preview'
                  ? 'bg-golden-gradient text-white'
                  : 'hover:bg-golden-light/10'
              }`}
            >
              Preview
            </button>
          </div>
        </div>

        {activeTab === 'details' ? (
          <div className="space-y-6">
            {/* Basic Details */}
            <div className="card space-y-4">
              <h2 className="text-2xl font-semibold bg-golden-gradient text-transparent bg-clip-text">
                Basic Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    School Name
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                    className="input-field"
                    placeholder="Enter school name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Board
                  </label>
                  <input
                    type="text"
                    value={formData.board}
                    disabled
                    className="input-field bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Select Grade</option>
                    {grades.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}       
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    className="input-field"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Chapters */}
            <div className="card space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold bg-golden-gradient text-transparent bg-clip-text">
                  Chapters
                </h2>
                <button
                  onClick={addChapter}
                  className="golden-button"
                >
                  Add Chapter
                </button>
              </div>
              
              {/* Chapter Input Form */}
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Enter chapter name"
                  className="input-field flex-1"
                  value={chapterInput}
                  onChange={(e) => setChapterInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addChapter();
                    }
                  }}
                />
              </div>

              {/* Chapters Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-golden-light/20">
                      <th className="py-2 px-4 text-left">Chapter Name</th>
                      <th className="py-2 px-4 text-center">1 Mark</th>
                      <th className="py-2 px-4 text-center">2 Marks</th>
                      <th className="py-2 px-4 text-center">3 Marks</th>
                      <th className="py-2 px-4 text-center">4 Marks</th>
                      <th className="py-2 px-4 text-center">5 Marks</th>
                      <th className="py-2 px-4 text-center">6 Marks</th>
                      <th className="py-2 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.chapters.map((chapter, index) => (
                      <tr key={index} className="border-b border-golden-light/20">
                        <td className="py-2 px-4">
                          <input
                            type="text"
                            value={chapter.name}
                            onChange={(e) => updateChapter(index, e.target.value)}
                            className="input-field w-full"
                            placeholder="Chapter name"
                          />
                        </td>
                        {[1, 2, 3, 4, 5, 6].map(marks => {
                          const question = chapter.questions.find(q => q.marks === marks);
                          return (
                            <td key={marks} className="py-2 px-4">
                              <input
                                type="number"
                                min="0"
                                className="input-field w-16 text-center mx-auto"
                                value={question?.count || 0}
                                onChange={(e) => updateQuestionDistribution(index, marks, parseInt(e.target.value) || 0)}
                              />
                            </td>
                          );
                        })}
                        <td className="py-2 px-4 text-center">
                          <button
                            onClick={() => removeChapter(index)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                    {formData.chapters.length > 0 && (
                      <tr className="bg-golden-light/5">
                        <td className="py-2 px-4 font-semibold">Total Marks</td>
                        <td colSpan={7} className="py-2 px-4 text-right font-semibold">
                          {calculateTotalMarks()}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Total Marks */}
            <div className="card">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Total Marks</h2>
                <span className="text-3xl font-bold bg-golden-gradient text-transparent bg-clip-text">
                  {calculateTotalMarks()}
                </span>
              </div>
            </div>

            {/* Generate Paper Button */}
            <button
              className="golden-button w-full py-4 text-lg font-semibold"
              onClick={() => {
                try {
                  // Validate form data
                  if (!formData.schoolName.trim()) throw new Error('Please enter school name');
                  if (!formData.grade) throw new Error('Please select grade');
                  if (!formData.subject) throw new Error('Please select subject');
                  if (formData.chapters.length === 0) throw new Error('Please add at least one chapter');
                  if (calculateTotalMarks() === 0) throw new Error('Please add questions to chapters');

                  // Generate paper template
                  const paperTemplate = `${formData.schoolName}
${formData.board} - ${formData.grade} ${formData.subject}
Total Marks: ${calculateTotalMarks()}

Question Paper

${formData.chapters.map((chapter, index) => {
  let chapterQuestions = `Chapter ${index + 1}: ${chapter.name}\n`;
  chapter.questions.forEach(q => {
    if (q.count > 0) {
      chapterQuestions += `${q.count} questions of ${q.marks} ${q.marks === 1 ? 'mark' : 'marks'} each\n`;
    }
  });
  return chapterQuestions;
}).join('\n')}`;

                  setGeneratedPaper(paperTemplate);
                  setActiveTab('preview');
                } catch (err: any) {
                  setError(err.message || 'Failed to generate paper template');
                }
              }}
              disabled={!formData.schoolName || !formData.grade || !formData.subject || formData.chapters.length === 0}
            >
              Generate Question Paper
            </button>
            {error && (
              <p className="text-red-500 text-center mt-2">{error}</p>
            )}
          </div>
        ) : (
          <div className="card space-y-4">
            <h2 className="text-2xl font-semibold bg-golden-gradient text-transparent bg-clip-text">
              Paper Preview
            </h2>
            <div className="min-h-[500px] border border-golden-light/20 rounded-lg p-6 overflow-auto whitespace-pre-wrap">
              {generatedPaper ? (
                <div className="prose max-w-none">{generatedPaper}</div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Generate a paper to see the preview</p>
                </div>
              )}
            </div>
            <button 
              className="golden-button w-full" 
              disabled={!generatedPaper}
              onClick={() => {
                // TODO: Implement PDF download functionality
                console.log('Downloading PDF...');
              }}
            >
              Download PDF
            </button>
          </div>
        )}
      </div>

      <div className="flowing-line" style={{ top: '15%', right: '10%' }} />
      <div className="flowing-line" style={{ bottom: '20%', left: '10%', animationDelay: '1s' }} />
      <BottomNav />
    </main>
  );
}