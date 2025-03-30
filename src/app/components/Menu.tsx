'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GenerateIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.636 5.636l2.122 2.122m8.484 8.484l2.122 2.122M5.636 18.364l2.122-2.122m8.484-8.484l2.122-2.122" />
  </svg>
);

const DoubtSolverIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const HomeworkIcon = ({ className = 'w-5 h-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    <line x1="12" y1="6" x2="16" y2="6" />
    <line x1="12" y1="10" x2="16" y2="10" />
    <line x1="12" y1="14" x2="16" y2="14" />
    <line x1="8" y1="6" x2="8" y2="6.01" />
    <line x1="8" y1="10" x2="8" y2="10.01" />
    <line x1="8" y1="14" x2="8" y2="14.01" />
  </svg>
);

export default function Menu() {
  const pathname = usePathname();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex flex-col gap-2 p-4 rounded-lg backdrop-blur-[90%] bg-black/30 border border-indigo-light/20" style={{ backgroundColor: 'var(--navbar-color)' }}>
        <Link
          href="/generate"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${pathname === '/generate' ? 'bg-indigo-light/20 text-white' : 'text-gray-100 hover:bg-indigo-light/10 hover:text-white'}`}
        >
          <GenerateIcon className="w-6 h-6" />
          <span className="text-sm font-medium">Generate</span>
        </Link>
        <Link
          href="/doubt-solver"
          className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${pathname === '/doubt-solver' ? 'bg-indigo-light/20 text-white' : 'text-gray-100 hover:bg-indigo-light/10 hover:text-white'}`}
        >
          <DoubtSolverIcon className="w-6 h-6" />
          <span className="text-sm font-medium">Doubt Solver</span>
        </Link>
      </div>
    </div>
  );
}