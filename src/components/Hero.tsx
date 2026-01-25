import { useState, useEffect, useRef } from 'react';
import { useGitHub } from '../hooks/useGitHub';
import { scrollToSection } from '../utils/scroll';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useTypingAnimation } from '../hooks/useTypingAnimation';
import { useEmailContact } from '../hooks/useEmailContact';
import { STATUS_TEXT, CONTENT_VARIANTS, CODE_SNIPPETS, ANIMATION_DELAYS } from '../utils/constants';
import { triggerGlitch, createFloatingElements } from '../utils/animations';

export const Hero = () => {
  const { user, loading, error, isConfigured } = useGitHub();
  const [glitchActive, setGlitchActive] = useState(false);
  const [currentHeading, setCurrentHeading] = useState(CONTENT_VARIANTS[0].heading);
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);
  const { emailCopied, errorMessage, isProcessing, handleContact } = useEmailContact();
  const { ref: textRef, isVisible: textVisible } = useScrollAnimation();
  const { ref: imageRef, isVisible: imageVisible } = useScrollAnimation();
  const particlesRef = useRef<HTMLDivElement>(null);

  const [statusComplete, setStatusComplete] = useState(false);
  const [descriptionReady, setDescriptionReady] = useState(false);
  const [currentDescription, setCurrentDescription] = useState('');

  // Status badge typing animation
  const { displayedText, showCursor } = useTypingAnimation({
    text: STATUS_TEXT,
    speed: ANIMATION_DELAYS.STATUS_TYPING,
    enabled: isConfigured && !loading && !error,
    onComplete: () => {
      setStatusComplete(true);
      triggerGlitch(setGlitchActive, ANIMATION_DELAYS.GLITCH_DURATION);
    },
  });

  // Trigger description typing after status completes
  useEffect(() => {
    if (statusComplete && !loading && !descriptionReady) {
      const timer = setTimeout(() => {
        // Select a random variant for the first description
        const selectedVariant = CONTENT_VARIANTS[Math.floor(Math.random() * CONTENT_VARIANTS.length)];
        setCurrentVariantIndex(CONTENT_VARIANTS.indexOf(selectedVariant));
        setCurrentHeading(selectedVariant.heading);
        setCurrentDescription(selectedVariant.description);
        setDescriptionReady(true);
      }, ANIMATION_DELAYS.STATUS_TO_DESCRIPTION_DELAY);
      return () => clearTimeout(timer);
    }
  }, [statusComplete, loading, descriptionReady]);

  // Description typing animation - starts after status badge completes
  const { displayedText: descriptionText, showCursor: showDescriptionCursor } = useTypingAnimation({
    text: currentDescription,
    speed: ANIMATION_DELAYS.DESCRIPTION_TYPING,
    enabled: descriptionReady && isConfigured && !loading && !error && currentDescription.length > 0,
    onComplete: () => {
      // Change heading and description after description finishes typing
      setTimeout(() => {
        // Select next random variant (different from current)
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * CONTENT_VARIANTS.length);
        } while (nextIndex === currentVariantIndex && CONTENT_VARIANTS.length > 1);
        
        setCurrentVariantIndex(nextIndex);
        setCurrentHeading(CONTENT_VARIANTS[nextIndex].heading);
        setDescriptionReady(false); // Reset to trigger next description
        triggerGlitch(setGlitchActive, ANIMATION_DELAYS.GLITCH_DURATION);
        
        // Re-enable description after glitch with new text
        setTimeout(() => {
          setCurrentDescription(CONTENT_VARIANTS[nextIndex].description);
          setDescriptionReady(true);
        }, ANIMATION_DELAYS.GLITCH_DURATION + 200);
      }, ANIMATION_DELAYS.HEADING_CHANGE_DELAY);
    },
  });


  // Create floating code snippets
  useEffect(() => {
    if (!particlesRef.current) return;

    const container = particlesRef.current;
    const snippets = createFloatingElements(container, CODE_SNIPPETS);

    return () => {
      snippets.forEach(snippet => snippet.remove());
    };
  }, []);

  return (
    <section id="hero" className="relative min-h-[500px] flex items-center overflow-hidden z-10 py-12">
      {/* Floating Code Snippets Background */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none" />
      
      <div className="max-w-7xl mx-auto p-4 md:p-8 w-full relative z-10">
        {!isConfigured ? (
          <div className="glass rounded-2xl p-8 md:p-12 max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white font-display">
              Welcome to My Portfolio
            </h1>
            <p className="text-gray-400 mb-6">GitHub integration is not configured</p>
            <div className="glass-strong rounded-lg p-6 text-left">
              <p className="text-gray-300 mb-4">
                Create a <code className="bg-slate-800 px-2 py-1 rounded text-purple-300">.env</code> file:
              </p>
              <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                <code className="text-purple-300">VITE_GITHUB_USERNAME=your-github-username</code>
              </pre>
            </div>
          </div>
        ) : loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-16 bg-white/10 rounded-lg w-64 mx-auto"></div>
            <div className="h-6 bg-white/10 rounded-lg w-96 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="glass rounded-2xl p-8 md:p-12 max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white font-display">Welcome</h1>
            <div className="glass-strong rounded-lg p-6 text-left">
              <p className="text-red-400 mb-2 font-semibold">Error Loading Data</p>
              <p className="text-gray-300 text-sm">{error.message}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div ref={textRef} className={`order-2 lg:order-1 space-y-6 ${textVisible ? 'animate-fadeInUp' : ''}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-mono tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>
                  {displayedText}
                  {showCursor && <span className="animate-blink">|</span>}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight font-display relative">
                <span className={`block transition-opacity duration-500 ${glitchActive ? 'animate-glitch' : ''}`}>
                  {currentHeading.line1}
                </span>
                <span className={`block text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-secondary transition-opacity duration-500 ${glitchActive ? 'animate-glitch' : ''}`}>
                  {currentHeading.line2}
                </span>
                {glitchActive && (
                  <>
                    <span className="absolute top-0 left-0 block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500 animate-glitch-fast opacity-80" aria-hidden="true">
                      {currentHeading.line1}<br/>{currentHeading.line2}
                    </span>
                    <span className="absolute top-0 left-0 block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 animate-glitch-fast opacity-80" style={{ animationDelay: '0.1s' }} aria-hidden="true">
                      {currentHeading.line1}<br/>{currentHeading.line2}
                    </span>
                  </>
                )}
              </h1>
              
              <div className="relative min-h-[120px]">
                <p className="text-slate-400 text-lg md:text-xl max-w-lg leading-relaxed font-mono">
                  <span className="text-primary">&gt;</span>{' '}
                  <span className="typing-text whitespace-pre-line">
                    {descriptionText}
                    {showDescriptionCursor && <span className="text-primary animate-blink ml-1">▋</span>}
                  </span>
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4 min-h-[60px] items-start">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg bg-primary px-8 font-bold text-background-dark transition-all duration-300 hover:bg-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark font-display"
                >
                  <span className="mr-2">INITIATE_PROJECTS</span>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
                <div className="relative">
                  <button
                    onClick={handleContact}
                    disabled={isProcessing}
                    className="relative inline-flex h-12 items-center justify-center rounded-lg border border-slate-600 bg-transparent px-8 font-medium text-white transition-all hover:bg-slate-800 hover:border-slate-500 focus:outline-none font-display disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <span className="material-symbols-outlined mr-2 animate-spin">sync</span>
                        Processing...
                      </>
                    ) : emailCopied ? (
                      <>
                        <span className="material-symbols-outlined mr-2 text-primary">check</span>
                        Email Copied!
                      </>
                    ) : (
                      'CONTACT_ME'
                    )}
                  </button>
                  {errorMessage && (
                    <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-red-500/90 text-white text-xs rounded-lg whitespace-nowrap z-50 animate-fadeIn">
                      {errorMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3D Mesh Representation */}
            <div ref={imageRef} className={`order-1 lg:order-2 flex flex-col items-center justify-center relative ${imageVisible ? 'animate-fadeInRight' : ''}`}>
              <div className="relative w-full">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 blur-[100px] rounded-full opacity-50"></div>
                <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-border-dark bg-surface-dark/30 backdrop-blur-sm group cursor-crosshair">
                  {/* Overlay Grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(37,226,244,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(37,226,244,0.1)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]"></div>
                  
                  {/* Central Image */}
                  <img
                    className="w-full h-full object-cover mix-blend-overlay opacity-60 transition-transform duration-700 group-hover:scale-110"
                    alt="Abstract 3D wireframe mesh glowing in dark space"
                    src="/hero.jpg"
                  />
                  
                  {/* HUD Elements */}
                  <div className="absolute top-4 left-4 font-mono text-xs text-primary/70">
                    <div>POS: [124, 55, 90]</div>
                    <div>ROT: 45deg</div>
                  </div>
                  <div className="absolute bottom-4 right-4 font-mono text-xs text-primary/70 text-right">
                    <div>RENDER: WEBGL</div>
                    <div>FPS: 60</div>
                  </div>
                  
                  {/* Center target reticle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-primary/30 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>
              
              {/* Name and Title under Image */}
              <div className="mt-8 space-y-3 text-center w-full">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50"></div>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-white font-display tracking-wide">
                  {user?.name || 'Rusydi Ahmad Yusof'}
                </h2>
                <p className="text-sm md:text-base text-slate-400 font-mono tracking-wider uppercase">
                  {user?.bio || 'Front End Web Developer'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
