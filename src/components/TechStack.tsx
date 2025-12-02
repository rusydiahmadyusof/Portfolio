import { useGitHub } from '../hooks/useGitHub';
import { getTechIcon } from '../utils/githubHelpers';

export const TechStack = () => {
  const { techStack, loading, error, isConfigured } = useGitHub();

  if (!isConfigured) {
    return (
      <section id="tech-stack" className="min-h-screen">
        <div className="container-custom">
          <h2 className="section-title text-center text-white">Tech Stack</h2>
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-gray-400">Configure your GitHub username to see your tech stack.</p>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section id="tech-stack" className="min-h-screen">
        <div className="container-custom">
          <h2 className="section-title text-center text-white">Tech Stack</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-24 bg-white/10 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="tech-stack" className="min-h-screen">
        <div className="container-custom">
          <h2 className="section-title text-center text-white">Tech Stack</h2>
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-red-400 mb-4">Error: {error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  if (techStack.length === 0) {
    return (
      <section id="tech-stack" className="min-h-screen">
        <div className="container-custom">
          <h2 className="section-title text-center text-white">Tech Stack</h2>
          <div className="glass rounded-2xl p-8 md:p-12 text-center">
            <p className="text-gray-300">No technologies detected from your repositories.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="tech-stack"
      className="min-h-screen flex items-center relative z-10"
    >
      <div className="container-custom w-full">
        <div className="text-center mb-20">
          <h2 className="section-title text-white">Tech Stack</h2>
          <p className="section-subtitle">
            Technologies and tools I use to build modern web applications
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 max-w-7xl">
            {techStack.map((tech) => {
              const techIcon = getTechIcon(tech.name);
              return (
                <div
                  key={tech.name}
                  className="glass rounded-xl p-4 md:p-6 hover:glass-strong flex flex-col items-center justify-center text-center group relative transition-all duration-150 hover:scale-110 hover:-translate-y-1"
                >
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-800/0 group-hover:from-purple-600/20 group-hover:to-purple-800/20 rounded-xl transition-all duration-150 pointer-events-none"></div>
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg mb-3 flex items-center justify-center p-2 bg-white/10 group-hover:bg-purple-600/20 transition-all duration-150 relative z-10">
                    <img
                      src={techIcon.url}
                      alt={tech.name}
                      className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:scale-110 transition-transform duration-150"
                      style={{ filter: 'brightness(0) invert(1)' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-2xl md:text-3xl font-bold" style="color: ${techIcon.color}">${tech.name.charAt(0)}</span>`;
                        }
                      }}
                    />
                  </div>
                  <h3 className="text-xs md:text-sm font-medium text-white group-hover:text-purple-300 transition-colors duration-150 relative z-10">
                    {tech.name}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
