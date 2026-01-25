import { useEffect, useState, useMemo } from 'react';
import { useGitHub } from '../hooks/useGitHub';
import { useSequentialTyping } from '../hooks/useSequentialTyping';

interface SplashScreenProps {
  onComplete?: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const { loading, isConfigured } = useGitHub();
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Generate particle positions once
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: (i * 37) % 100, // Pseudo-random but deterministic
      top: (i * 23) % 100,
      delay: (i * 0.3) % 2,
      duration: 10 + (i % 10),
    }));
  }, []);

  // Memoize loading messages based on configuration
  const loadingMessages = useMemo(() => {
    return [
      'Initializing system...',
      ...(isConfigured ? ['Loading GitHub profile...', 'Fetching repositories...', 'Compiling tech stack...'] : []),
      'System ready.',
    ];
  }, [isConfigured]);

  const { displayText, showCursor } = useSequentialTyping({
    messages: loadingMessages,
    typingSpeed: 50,
    pauseBetweenMessages: 800,
    enabled: true,
  });

  useEffect(() => {
    // Hide splash screen when loading is complete or if not configured
    if (!loading || !isConfigured) {
      // Start exit animation
      setIsExiting(true);
      
      // Wait for animation to complete, then hide and call onComplete
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 800); // Match animation duration
      
      return () => clearTimeout(timer);
    }
  }, [loading, isConfigured, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background-dark transition-all duration-700 ease-in-out ${
        isExiting
          ? 'opacity-0 scale-110 blur-md pointer-events-none'
          : 'opacity-100 scale-100 blur-0'
      }`}
    >
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(37,226,244,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(37,226,244,0.1)_1px,transparent_1px)] bg-[size:40px_40px] animate-[dot-grid-move_20s_linear_infinite]"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>

      {/* Main Content */}
      <div
        className={`relative z-10 text-center space-y-8 transition-all duration-700 ease-in-out ${
          isExiting ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
            <div className="relative w-24 h-24 rounded-full border-2 border-primary/50 bg-background-dark flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-primary">
                code
              </span>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white font-display tracking-tight">
            Portfolio
          </h1>
          
          <div className="h-8 flex items-center justify-center">
            <p className="text-lg md:text-xl text-primary font-mono">
              <span className="text-slate-400">&gt;</span>{' '}
              {displayText}
              {showCursor && <span className="text-primary animate-blink ml-1">▋</span>}
            </p>
          </div>
        </div>

        {/* Loading Bar */}
        <div className="w-64 mx-auto">
          <div className="h-1 bg-surface-dark rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary via-secondary to-primary animate-[loading-bar_2s_ease-in-out_infinite]"></div>
          </div>
        </div>

        {/* Version Info */}
        <p className="text-xs text-slate-500 font-mono">
          V.2.0.4
        </p>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary rounded-full opacity-30"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `floatCode ${particle.duration}s infinite ease-in-out`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

