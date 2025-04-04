'use client';

import { useState, useEffect } from 'react';
import OpenAI from 'openai';
import { useRouter } from 'next/navigation';
import BottomNav from '../dashboard/components/BottomNav';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import jsPDF from 'jspdf';

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

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "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",
    defaultHeaders: {
      "HTTP-Referer": "https://kelvi.ai",
      "X-Title": "Kelvi AI",
    },
    dangerouslyAllowBrowser: true
  });
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
        <h1 className="ka-text-box text-3xl font-bold text-center bg-indigo-gradient text-transparent bg-clip-text">Powered by Ka1.2</h1>
        {/* Tabs */}
        <div className="card p-4">
          <div className="flex space-x-4 border-b border-indigo-light/20 pb-4">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'details'
                  ? 'bg-indigo-gradient text-white'
                  : 'hover:bg-indigo-light/10'
              }`}
            >
              Paper Details
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'preview'
                  ? 'bg-indigo-gradient text-white'
                  : 'hover:bg-indigo-light/10'
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
              <h2 className="text-2xl font-semibold bg-indigo-gradient text-transparent bg-clip-text">
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
                <h2 className="text-2xl font-semibold bg-indigo-gradient text-transparent bg-clip-text">
                  Chapters
                </h2>
                <button
                  onClick={addChapter}
                  className="indigo-button"
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
                    <tr className="border-b border-indigo-light/20">
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
                      <tr key={index} className="border-b border-indigo-light/20">
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
                      <tr className="bg-indigo-light/5">
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
                <span className="text-3xl font-bold bg-indigo-gradient text-transparent bg-clip-text">
                  {calculateTotalMarks()}
                </span>
              </div>
            </div>

            {/* Generate Paper Button */}
            <button
              className="indigo-button w-full py-4 text-lg font-semibold"
              onClick={async () => {
                try {
                  // Validate form data
                  if (!formData.schoolName.trim()) throw new Error('Please enter school name');
                  if (!formData.grade) throw new Error('Please select grade');
                  if (!formData.subject) throw new Error('Please select subject');
                  if (formData.chapters.length === 0) throw new Error('Please add at least one chapter');
                  if (calculateTotalMarks() === 0) throw new Error('Please add questions to chapters');

                  setError('');
                  setLoading(true);
                  setActiveTab('preview');
                  
                  try {
                    // Format the prompt for AI
                    const prompt = `Generate a question paper with the following format:

GENERATED BY Ka1.2
Kelvi Edtech™
${formData.grade} - ${formData.subject}
Total Marks: ${calculateTotalMarks()}

INSTRUCTIONS:
1. All answers must be written in the answer booklet
2. All questions are compulsory
3. Use blue/black pen only

QUESTION PAPER START

${formData.chapters.map((chapter, index) => {
  let chapterInfo = `// ${chapter.name}\n`;
  chapter.questions.forEach(q => {
    if (q.count > 0) {
      if (q.marks === 1) {
        chapterInfo += `Generate ${q.count} Multiple Choice Questions (MCQ) of ${q.marks} mark each\n`;
      } else {
        chapterInfo += `Generate ${q.count} questions of ${q.marks} marks each\n`;
      }
    }
  });
  return chapterInfo;
}).join('\n')}

QUESTION PAPER END

ANSWER SECTION START
[Include detailed solutions here]

Notes:
1. Use LaTeX notation for all mathematical expressions (e.g. \\sin \\theta, \\frac{a}{b})
2. Format mathematical expressions with $...$ for inline math or $$....$$ for display math
3. For MCQs, provide 4 options (a, b, c, d) and clearly mark the correct answer
4. For other questions, provide detailed step-by-step solutions`;

                    const completion = await openai.chat.completions.create({
                      model: "deepseek/deepseek-r1-distill-llama-70b:free",
                      messages: [
                        {
                          "role": "user",
                          "content": prompt
                        }
                      ],
                    });

                    const generatedContent = completion.choices[0].message.content;
                    if (!generatedContent) throw new Error('Failed to generate content');
                    
                    // Process the content to render LaTeX expressions and text formatting
                    let processedContent = generatedContent || '';
                    
                    // Replace LaTeX delimiters with rendered math
                    processedContent = processedContent.replace(/\$\$([^$]+)\$\$/g, (_, tex) => {
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

                    // Process text formatting
                    processedContent = processedContent
                      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') // Bold
                      .replace(/\*([^*]+)\*/g, '<em>$1</em>') // Italic
                      .replace(/\_([^_]+)\_/g, '<u>$1</u>') // Underline
                      .replace(/\#([^#]+)\#/g, '<mark>$1</mark>'); // Highlight

                    const paperTemplate = `<h1 class="text-2xl font-bold mb-4">${formData.schoolName}</h1>${processedContent}`;
                    setGeneratedPaper(paperTemplate);
                  } catch (err: any) {
                    console.error('API Error:', err);
                    setError(err.message || 'Failed to generate paper');
                  } finally {
                    setLoading(false);
                  }
                } catch (err: any) {
                  console.error('API Error:', err);
                  setError(err.message || 'Failed to generate paper template');
                } finally {
                  setLoading(false);
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
            <h2 className="text-2xl font-semibold bg-indigo-gradient text-transparent bg-clip-text">
              Paper Preview
            </h2>
            <div className="min-h-[500px] max-h-[50vh] border border-indigo-light/20 rounded-lg p-6 overflow-y-auto whitespace-pre-wrap">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Generating your paper...</p>
                </div>
              ) : generatedPaper ? (
                <div className="prose max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: generatedPaper }} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Generate a paper to see the preview</p>
                </div>
              )}
            </div>
            <button 
              className="indigo-button w-full" 
              disabled={!generatedPaper}
              onClick={() => {
                const doc = new jsPDF({
                  unit: 'mm',
                  format: 'a4',
                  putOnlyUsedFonts: true
                });

                // Set margins
                const margin = 20; // 20mm margins
                const pageWidth = doc.internal.pageSize.width;
                const pageHeight = doc.internal.pageSize.height;
                const contentWidth = pageWidth - 2 * margin;

                // Create a temporary div to render the content
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = generatedPaper;

                // Process LaTeX content
                const processLatex = (text: string) => {
                  return text.replace(/\$(.*?)\$/g, (_, tex) => {
                    try {
                      return katex.renderToString(tex, { output: 'html' });
                    } catch (err) {
                      console.error('LaTeX Error:', err);
                      return tex;
                    }
                  });
                };

                // Extract and process text content
                let content = tempDiv.textContent || tempDiv.innerText;
                content = processLatex(content);

                // Add school name as header
                doc.setFontSize(16);
                doc.text(formData.schoolName, margin, margin);

                // Add content with proper formatting
                doc.setFontSize(12);
                let y = margin + 10;

                // Split content into lines with proper width
                const lines = doc.splitTextToSize(content, contentWidth);

                // Add lines to PDF with proper spacing and page breaks
                lines.forEach((line: string) => {
                  if (y > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                  }

                  // Check if line contains mathematical content
                  if (line.match(/[\u0370-\u03FF\u2200-\u22FF]/)) {
                    // Use special font or symbol handling for mathematical content
                    doc.setFont('Helvetica', 'normal');
                  } else {
                    doc.setFont('Helvetica', 'normal');
                  }

                  doc.text(line, margin, y);
                  y += 7; // Line spacing
                });

                // Save the PDF
                doc.save(`${formData.schoolName.replace(/\s+/g, '_')}_${formData.subject}_${formData.grade}.pdf`);
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