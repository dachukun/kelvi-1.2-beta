import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flowing-background flex flex-col items-center justify-center p-4">
      <div className="relative z-10 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 bg-indigo-gradient text-transparent bg-clip-text">
          KelviAI
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-12">
          Your Intelligent Learning Assistant
        </p>
        <div>
          <Link href="/login" className="indigo-button">
            Login
          </Link>
        </div>
      </div>
      
      {/* Animated flowing lines */}
      <div className="flowing-line" style={{ top: '20%', left: '10%' }} />
      <div className="flowing-line" style={{ top: '40%', right: '15%', animationDelay: '1s' }} />
      <div className="flowing-line" style={{ bottom: '30%', left: '20%', animationDelay: '2s' }} />
    </main>
  );
}