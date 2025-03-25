'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

const GenerateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
  </svg>
);

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-md border-t border-indigo-light/20 z-50" style={{ backgroundColor: 'var(--navbar-color)' }}>
      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          <Link
            href="/dashboard"
            className={`flex flex-col items-center p-2 transition-colors ${pathname === '/dashboard' ? 'text-cream' : 'text-gray-500 hover:text-indigo-light'}`}
          >
            <HomeIcon />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            href="/generate"
            className={`flex flex-col items-center p-2 transition-colors ${pathname === '/generate' ? 'text-cream' : 'text-gray-500 hover:text-indigo-light'}`}
          >
            <GenerateIcon />
            <span className="text-xs mt-1">Generate</span>
          </Link>
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
    </nav>
  );
}