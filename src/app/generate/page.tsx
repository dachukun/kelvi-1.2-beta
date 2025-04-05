'use client';

import { useState } from 'react';
import BottomNav from '../dashboard/components/BottomNav';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import jsPDF from 'jspdf';
import { openai } from '@/utils/openai';

const calculateTotalMarks = (data: FormData) => {
  return data.chapters.reduce((total, chapter) => {
    return total + chapter.questions.reduce((chapterTotal, q) => 
      chapterTotal + (q.marks * q.count), 0);
  }, 0);
};

// Template-based question paper generation
const generateQuestionTemplate = (formData: FormData) => {
  const totalMarks = calculateTotalMarks(formData);
  const currentDate = new Date().toLocaleDateString();
  
  let template = `${formData.schoolName}\n`;
  template += `${formData.subject} Question Paper - Grade ${formData.grade}\n`;
  template += `Date: ${currentDate}\n`;
  template += `Total Marks: ${totalMarks}\n\n`;
  template += `Time: ${Math.ceil(totalMarks/20)} hours\n\n`;
  template += `General Instructions:\n`;
  template += `1. All questions are compulsory\n`;
  template += `2. The question paper consists of ${formData.chapters.length} sections\n`;
  template += `3. Marks are indicated against each question\n\n`;

  formData.chapters.forEach((chapter, index) => {
    template += `Section ${String.fromCharCode(65 + index)} - ${chapter.name}\n\n`;
    
    let questionNumber = 1;
    [1, 2, 3, 4, 5, 6].forEach(marks => {
      const questionsOfMark = chapter.questions.find(q => q.marks === marks);
      if (questionsOfMark && questionsOfMark.count > 0) {
        for (let i = 0; i < questionsOfMark.count; i++) {
          template += `${questionNumber}. Sample question for ${chapter.name} worth ${marks} mark${marks > 1 ? 's' : ''}\n`;
          if (formData.subject === 'Mathematics') {
            template += `   $\\frac{x}{2} + y = z$\n`;
          }
          template += `   [${marks} mark${marks > 1 ? 's' : ''}]\n\n`;
          questionNumber++;
        }
      }
    });
  });

  return template;
};

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

  

  const generatePaper = async () => {
    try {
      // Validate form data
      if (!formData.schoolName.trim()) throw new Error('Please enter school name');
      if (!formData.grade) throw new Error('Please select grade');
      if (!formData.subject) throw new Error('Please select subject');
      if (formData.chapters.length === 0) throw new Error('Please add at least one chapter');
      if (calculateTotalMarks(formData) === 0) throw new Error('Please add questions to chapters');

      setError('');
      setLoading(true);

      // Prepare prompt for AI
      const prompt = `Please generate a moderate level practice question paper with the following details:
      School: ${formData.schoolName}
      Subject: ${formData.subject}
      Grade: ${formData.grade}
      Total Marks: ${calculateTotalMarks(formData)}
      Chapters: ${formData.chapters.map(c => c.name).join(', ')}

      Question distribution per chapter:
      ${formData.chapters.map(chapter => {
        const questions = chapter.questions
          .filter(q => q.count > 0)
          .map(q => `${q.count} questions of ${q.marks} marks each`);
        return `${chapter.name}: ${questions.join(', ')}`;
      }).join('\n')}

      Please ensure:
      1. Questions are grade-appropriate and moderate difficulty
      2. Clear and precise language
      3. For Mathematics, include proper mathematical expressions
      4. Logical progression from easier to harder questions
      5. Questions test both conceptual understanding and application`;

      // Call OpenAI API
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Kelvi AI",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": "deepseek/deepseek-r1:free",
          "messages": [{
            "role": "system",
            "content": "You are an expert teacher who creates high-quality exam papers. Format the output with proper section headers, question numbers, and clear instructions. Include a mix of objective and subjective questions appropriate for the subject and grade level. Use LaTeX for mathematical equations where applicable."
          }, {
            "role": "user",
            "content": prompt
          }],
          "temperature": 0.7,
          "max_tokens": 2000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      const generatedContent = data.choices?.[0]?.message?.content;
      
      if (!generatedContent) {
        throw new Error('Failed to generate paper content');
      }
      
      setGeneratedPaper(generatedContent);
      // Ensure we switch to preview tab after successful generation
      setActiveTab('preview');
    } catch (err: any) {
      console.error('Generation Error:', err);
      setError(err.message || 'Failed to generate paper. Please try again.');
      setGeneratedPaper('');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF({
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true
      });

      const margin = 20;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const contentWidth = pageWidth - 2 * margin;

      // Add header
      doc.setFontSize(16);
      doc.text(formData.schoolName, margin, margin);

      // Add subject and grade
      doc.setFontSize(14);
      doc.text(`${formData.subject} - Grade ${formData.grade}`, margin, margin + 10);

      // Add content
      doc.setFontSize(12);
      let y = margin + 20;

      // Split content into sections and process LaTeX
      const sections = generatedPaper.split('\n\n');

      sections.forEach(section => {
        const lines = doc.splitTextToSize(section, contentWidth);
        
        lines.forEach((line: string) => {
          if (y > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }

          // Check if line contains mathematical content
          if (line.match(/\$(.*?)\$/)) {
            // Use special font for mathematical content
            doc.setFont('Helvetica-Bold', 'normal');
          } else {
            doc.setFont('Helvetica', 'normal');
          }

          doc.text(line.replace(/\$(.*?)\$/g, '$1'), margin, y);
          y += 7;
        });

        y += 5; // Add extra space between sections
      });

      doc.save(`${formData.schoolName.replace(/\s+/g, '_')}_${formData.subject}_${formData.grade}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      setError('Failed to generate PDF. Please try again.');
    }
  };

  const renderLatexContent = (content: string) => {
    return content.split('$').map((part, index) => {
      if (index % 2 === 0) {
        return part;
      }
      try {
        return (
          <span
            key={index}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(part, {
                throwOnError: false,
                displayMode: false
              })
            }}
          />
        );
      } catch (err) {
        console.error('LaTeX Error:', err);
        return `$${part}$`;
      }
    });
  };

  return (
    <main className="min-h-screen flowing-background p-4 pb-20 md:p-8 md:pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center bg-indigo-gradient text-transparent bg-clip-text">Question Paper Generator</h1>
        <p className="ka-text-box text-sm text-center bg-indigo-gradient text-transparent bg-clip-text">Powered by Ka1.2</p>

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
                          {calculateTotalMarks(formData)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Total Marks</h2>
                <span className="text-3xl font-bold bg-indigo-gradient text-transparent bg-clip-text">
                  {calculateTotalMarks(formData)}
                </span>
              </div>
            </div>

            <button
              className="indigo-button w-full py-4 text-lg font-semibold"
              onClick={generatePaper}
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
                <div className="prose max-w-none whitespace-pre-wrap">
                  {generatedPaper.split('\n').map((line, i) => (
                    <p key={i}>
                      {line.split('$').map((part, j) => {
                        if (j % 2 === 0) {
                          // Process non-LaTeX text with enhanced formatting
                          const processedText = part
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            .replace(/_(.*?)_/g, '<u>$1</u>')
                            .replace(/~(.*?)~/g, '<sub>$1</sub>')
                            .replace(/\^(.*?)\^/g, '<sup>$1</sup>');
                          return <span dangerouslySetInnerHTML={{ __html: processedText }} />;
                        }
                        // Process LaTeX expressions with enhanced symbol handling
                        try {
                          const processedLatex = part
                            .replace(/theta/g, '\\theta')
                            .replace(/phi/g, '\\phi')
                            .replace(/pi/g, '\\pi')
                            .replace(/sum/g, '\\sum')
                            .replace(/int/g, '\\int');
                          return (
                            <span
                              key={`latex-${j}`}
                              dangerouslySetInnerHTML={{
                                __html: katex.renderToString(processedLatex, {
                                  throwOnError: false,
                                  displayMode: true,
                                  strict: false
                                })
                              }}
                            />
                          );
                        } catch (err) {
                          console.error('LaTeX Error:', err);
                          return part;
                        }
                      })}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">Generate a paper to see the preview</p>
                </div>
              )}
            </div>
            <button 
              className="indigo-button w-full" 
              disabled={!generatedPaper}
              onClick={downloadPDF}
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