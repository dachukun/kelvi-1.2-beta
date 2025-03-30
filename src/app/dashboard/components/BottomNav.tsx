'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
const HomeworkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
    <defs>
      <linearGradient id="homeworkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
      </linearGradient>
    </defs>
    {/* Open book base */}
    <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V6Z" stroke="url(#homeworkGradient)" strokeWidth="1.5" strokeLinejoin="round"/>
    {/* Book spine */}
    <path d="M12 4V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
    </path>
    {/* Left page lines */}
    <path d="M7 8H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.2s"/>
    </path>
    <path d="M7 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.4s"/>
    </path>
    {/* Right page lines */}
    <path d="M14 8H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.6s"/>
    </path>
    <path d="M14 12H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.8s"/>
    </path>
    {/* Pencil */}
    <path d="M8 16L10 18L16 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <animate attributeName="strokeDasharray" values="20;10;20" dur="2s" repeatCount="indefinite"/>
    </path>
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
    <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
  </svg>
);

const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </svg>
);

const SupportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
  </svg>
);

const ExperimentsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
    <defs>
      <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="1" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glow)">
      {/* Neural Network Nodes */}
      <circle cx="12" cy="6" r="2" fill="currentColor">
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="6" cy="12" r="2" fill="currentColor">
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.3s"/>
      </circle>
      <circle cx="18" cy="12" r="2" fill="currentColor">
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.6s"/>
      </circle>
      <circle cx="12" cy="18" r="2" fill="currentColor">
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.9s"/>
      </circle>
      
      {/* Neural Network Connections */}
      <path d="M12 8L6 10M12 8L18 10M6 14L12 16M18 14L12 16" stroke="url(#networkGradient)" strokeWidth="1.5" strokeLinecap="round">
        <animate attributeName="stroke-dasharray" values="1,3;3,1" dur="1s" repeatCount="indefinite"/>
      </path>
      
      {/* Data Flow Animation */}
      <circle cx="0" cy="0" r="1" fill="currentColor">
        <animateMotion path="M12 8L6 10" dur="1.5s" repeatCount="indefinite">
          <mpath href="#flow-path"/>
        </animateMotion>
      </circle>
      <path id="flow-path" d="M12 8L6 10M12 8L18 10M6 14L12 16M18 14L12 16" stroke="none"/>
    </g>
  </svg>
);

const GenerateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
    <defs>
      <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2"/>
        <stop offset="50%" stopColor="currentColor" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="1" result="blur"/>
        <feMerge>
          <feMergeNode in="blur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glow)">
      <path d="M12 3L14 9L20 9L15 13L17 19L12 15L7 19L9 13L4 9L10 9L12 3Z" stroke="url(#sparkleGradient)" strokeWidth="1.5" strokeLinejoin="round" fill="none">
        <animate attributeName="stroke-dasharray" values="60;30;60" dur="2s" repeatCount="indefinite"/>
      </path>
      <circle cx="12" cy="12" r="1" fill="currentColor">
        <animate attributeName="r" values="0.5;1;0.5" dur="1s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0.5;1" dur="1s" repeatCount="indefinite"/>
      </circle>
      <g transform="rotate(45 12 12)">
        <path d="M12 7L12 9M12 15L12 17M7 12L9 12M15 12L17 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <animate attributeName="opacity" values="1;0;1" dur="1.5s" repeatCount="indefinite"/>
        </path>
      </g>
    </g>
  </svg>
);

const DoubtSolverIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
    <defs>
      <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
      </linearGradient>
    </defs>
    <path d="M12 4C7 4 4 7.5 4 11C4 14.5 6 16 8 16.5C8 17.5 7 19 7 19C11 19 12 16.5 12 16.5C12 16.5 13 19 17 19C17 19 16 17.5 16 16.5C18 16 20 14.5 20 11C20 7.5 17 4 12 4Z" stroke="url(#brainGradient)" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 11C9 11 10 12 12 12C14 12 15 11 15 11" strokeWidth="1.5" strokeLinecap="round">
      <animate attributeName="d" values="M9 11C9 11 10 12 12 12C14 12 15 11 15 11;M9 10C9 10 10 11 12 11C14 11 15 10 15 10;M9 11C9 11 10 12 12 12C14 12 15 11 15 11" dur="2s" repeatCount="indefinite"/>
    </path>
    <circle cx="8" cy="9" r="1" fill="currentColor">
      <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite"/>
    </circle>
    <circle cx="16" cy="9" r="1" fill="currentColor">
      <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" begin="0.5s"/>
    </circle>
  </svg>
);

const PaperAnalysisIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-6 h-6">
    <defs>
      <linearGradient id="paperGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.2"/>
        <stop offset="100%" stopColor="currentColor" stopOpacity="1"/>
      </linearGradient>
    </defs>
    <path d="M6 3H18V21H6C4.89543 21 4 20.1046 4 19V5C4 3.89543 4.89543 3 6 3Z" stroke="url(#paperGradient)" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M8 7H16" strokeWidth="1.5" strokeLinecap="round">
      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
    </path>
    <path d="M8 11H16" strokeWidth="1.5" strokeLinecap="round">
      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.5s"/>
    </path>
    <path d="M8 15H12" strokeWidth="1.5" strokeLinecap="round">
      <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="1s"/>
    </path>
    <path d="M14 13L16 15L14 17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <animate attributeName="transform" type="translate" values="0,0;1,0;0,0" dur="1s" repeatCount="indefinite"/>
    </path>
  </svg>
);

export default function BottomNav() {
  const pathname = usePathname();
  const [isExperimentsOpen, setIsExperimentsOpen] = useState(false);

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="max-w-4xl mx-auto">
        <div className="backdrop-blur-md border border-indigo-light/20 rounded-2xl overflow-hidden animate-fade-in" style={{ backgroundColor: 'var(--navbar-color)' }}>
          {isExperimentsOpen && (
            <div className="p-4 border-b border-indigo-light/20 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/generate"
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/generate' ? 'bg-indigo-light/20 text-cream' : 'text-gray-500 hover:bg-indigo-light/10 hover:text-indigo-light'}`}
                  onClick={() => setIsExperimentsOpen(false)}
                >
                  <GenerateIcon />
                  <span className="text-sm font-medium">Generate</span>
                </Link>
                <Link
                  href="/doubt-solver"
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/doubt-solver' ? 'bg-indigo-light/20 text-cream' : 'text-gray-500 hover:bg-indigo-light/10 hover:text-indigo-light'}`}
                  onClick={() => setIsExperimentsOpen(false)}
                >
                  <DoubtSolverIcon />
                  <span className="text-sm font-medium">Doubt Solver</span>
                </Link>
                <Link
                  href="/paper-analysis"
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/paper-analysis' ? 'bg-indigo-light/20 text-cream' : 'text-gray-500 hover:bg-indigo-light/10 hover:text-indigo-light'}`}
                  onClick={() => setIsExperimentsOpen(false)}
                >
                  <PaperAnalysisIcon />
                  <span className="text-sm font-medium">Paper Analysis</span>
                </Link>
                <Link
                  href="/homework-assistance"
                  className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${pathname === '/homework-assistance' ? 'bg-indigo-light/20 text-cream' : 'text-gray-500 hover:bg-indigo-light/10 hover:text-indigo-light'}`}
                  onClick={() => setIsExperimentsOpen(false)}
                >
                  <HomeworkIcon />
                  <span className="text-sm font-medium">Homework Help</span>
                </Link>
              </div>
            </div>
          )}
          <div className="flex justify-around items-center px-4 py-2">
            <Link
              href="/dashboard"
              className={`flex flex-col items-center p-2 transition-colors ${pathname === '/dashboard' ? 'text-cream' : 'text-gray-500 hover:text-indigo-light'}`}
            >
              <HomeIcon />
              <span className="text-xs mt-1">Home</span>
            </Link>
            <button
              onClick={() => setIsExperimentsOpen(!isExperimentsOpen)}
              className={`flex flex-col items-center p-2 transition-colors ${isExperimentsOpen || pathname === '/generate' || pathname === '/doubt-solver' ? 'text-cream' : 'text-gray-500 hover:text-indigo-light'}`}
            >
              <ExperimentsIcon />
              <span className="text-xs mt-1">Experiments</span>
            </button>
            <Link
              href="/profile"
              className={`flex flex-col items-center p-2 transition-colors ${pathname === '/profile' ? 'text-cream' : 'text-gray-500 hover:text-indigo-light'}`}
            >
              <ProfileIcon />
              <span className="text-xs mt-1">Profile</span>
            </Link>
            <Link
              href="/support"
              className={`flex flex-col items-center p-2 transition-colors ${pathname === '/support' ? 'text-cream' : 'text-gray-500 hover:text-indigo-light'}`}
            >
              <SupportIcon />
              <span className="text-xs mt-1">Support</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}