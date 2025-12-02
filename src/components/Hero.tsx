import { useState, useEffect } from 'react';
import { useGitHub } from '../hooks/useGitHub';

export const Hero = () => {
  const { user, loading, error, isConfigured } = useGitHub();
  
  const sentences = [
    {
      text: 'Crafting',
      highlight: 'pixel-perfect',
      text2: ', ',
      highlight2: 'high-performance',
      text3: ' web experiences that users ',
      highlight3: 'love',
      text4: '.'
    },
    {
      text: 'Transforming',
      highlight: 'complex designs',
      text2: ' into ',
      highlight2: 'seamless',
      text3: ', ',
      highlight3: 'responsive',
      text4: ' interfaces.'
    },
    {
      text: 'Building',
      highlight: 'fast',
      text2: ', ',
      highlight2: 'accessible',
      text3: ', and ',
      highlight3: 'scalable',
      text4: ' web solutions.'
    },
    {
      text: 'Delivering',
      highlight: 'cutting-edge',
      text2: ' web experiences with ',
      highlight2: 'modern',
      text3: ' technologies and ',
      highlight3: 'best practices',
      text4: '.'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sentences.length);
        setIsVisible(true);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentSentence = sentences[currentIndex];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden z-10">
      {/* Static background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-800/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom w-full relative z-10">
        {!isConfigured ? (
          <div className="glass rounded-2xl p-8 md:p-12 max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Welcome to My Portfolio
            </h1>
            <p className="text-gray-400 mb-6">GitHub integration is not configured</p>
            <div className="glass-strong rounded-lg p-6 text-left">
              <p className="text-gray-300 mb-4">
                Create a <code className="bg-slate-800 px-2 py-1 rounded text-purple-300">.env</code> file:
              </p>
              <pre className="bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm">
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Welcome</h1>
            <div className="glass-strong rounded-lg p-6 text-left">
              <p className="text-red-400 mb-2 font-semibold">Error Loading Data</p>
              <p className="text-gray-300 text-sm">{error.message}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="text-center lg:text-left space-y-6">
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="text-sm md:text-base text-purple-400 font-semibold uppercase tracking-wider">
                    Front End Web Developer
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="block bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
                    Rusydi
                  </span>
                  <span className="block bg-gradient-to-r from-purple-400 via-purple-200 to-white bg-clip-text text-transparent">
                    Ahmad Yusof
                  </span>
                </h1>
                <div className="relative h-20 md:h-24 flex items-center">
                  <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed absolute inset-0 flex items-center">
                    <span 
                      className={`inline-block transition-all duration-300 ${
                        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                      }`}
                    >
                      {currentSentence.text}{' '}
                      <span className="text-purple-400 font-semibold">{currentSentence.highlight}</span>
                      {currentSentence.text2}
                      {currentSentence.highlight2 && (
                        <span className="text-purple-400 font-semibold">{currentSentence.highlight2}</span>
                      )}
                      {currentSentence.text3}
                      {currentSentence.highlight3 && (
                        <span className="text-purple-400 font-semibold">{currentSentence.highlight3}</span>
                      )}
                      {currentSentence.text4}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => scrollToSection('projects')}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg font-semibold transition-all duration-150 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 hover:scale-105 active:scale-95"
                >
                  View Projects
                </button>
                {user?.html_url && (
                  <a
                    href={user.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 glass hover:glass-strong rounded-lg font-semibold transition-all duration-150 inline-flex items-center gap-2 border border-white/20 hover:border-purple-500/50 hover:scale-105 active:scale-95"
                  >
                    <i className="bi bi-github"></i>
                    GitHub
                  </a>
                )}
              </div>
            </div>

            <div className="flex justify-center order-first lg:order-last">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-full blur-2xl transition-all duration-200"></div>
                <img
                  src="/hero.jpg"
                  alt="Rusydi Ahmad Yusof"
                  className="relative glass rounded-full overflow-hidden w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 border-4 border-white/20 group-hover:border-purple-500/50 transition-all duration-200 object-cover group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
