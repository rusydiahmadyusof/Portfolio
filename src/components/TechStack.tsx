import { useGitHub } from '../hooks/useGitHub';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { TechBrandIcon } from './TechBrandIcon';
import { getTechColor } from '../utils/techHelpers';
import { DISPLAY_LIMITS, PROFILE_TECH_STACK } from '../utils/constants';

export const TechStack = () => {
  const { techStack, loading, error, isConfigured } = useGitHub();
  const { ref: containerRef, isVisible: containerVisible } = useScrollAnimation();

  if (!isConfigured) {
    return (
      <section id="tech-stack" className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
            <span className="material-symbols-outlined text-primary">hub</span>
            // TECH_STACK.NET
          </h3>
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-gray-400">Configure your GitHub username to see your tech stack.</p>
          </div>
        </div>
      </section>
    );
  }

  const curatedTech =
    PROFILE_TECH_STACK.length > 0
      ? PROFILE_TECH_STACK.slice(0, DISPLAY_LIMITS.TECH_STACK).map((name) => ({
          name,
          bytes: 1,
          percentage: 0,
        }))
      : null;

  if (!curatedTech) {
    if (loading) {
      return (
        <section id="tech-stack" className="min-h-screen py-12">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
              <span className="material-symbols-outlined text-primary">hub</span>
              // TECH_STACK.NET
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-24 bg-white/10 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (error) {
      return (
        <section id="tech-stack" className="min-h-screen py-12">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
              <span className="material-symbols-outlined text-primary">hub</span>
              // TECH_STACK.NET
            </h3>
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-red-400 mb-4">Error: {error.message}</p>
            </div>
          </div>
        </section>
      );
    }

    if (techStack.length === 0) {
      return (
        <section id="tech-stack" className="min-h-screen py-12">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
              <span className="material-symbols-outlined text-primary">hub</span>
              // TECH_STACK.NET
            </h3>
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-gray-300">No technologies detected from your repositories.</p>
            </div>
          </div>
        </section>
      );
    }
  }

  const displayedTech = curatedTech ?? techStack.slice(0, DISPLAY_LIMITS.TECH_STACK);

  return (
    <section id="tech-stack" className="relative min-h-screen flex items-center overflow-hidden z-10 py-12">
      <div className="max-w-7xl mx-auto p-4 md:p-8 w-full">
        <div className="lg:col-span-5 flex flex-col">
          <h3 className={`text-xl font-bold text-white mb-4 flex items-center gap-2 font-display ${containerVisible ? 'animate-fadeInUp' : ''}`}>
            <span className="material-symbols-outlined text-primary">hub</span>
            // TECH_STACK.NET
          </h3>
          <div ref={containerRef} className={`flex-1 rounded-lg border border-border-dark bg-background-dark p-6 relative overflow-hidden group ${containerVisible ? 'animate-scaleIn' : ''}`}>
            {/* Circuit Lines Background */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(#25e2f4 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            ></div>
            <div className="grid grid-cols-4 gap-6 relative z-10 h-full content-center">
              {displayedTech.map((tech, index) => {
                const color = getTechColor(tech.name);
                return (
                  <div 
                    key={tech.name} 
                    className={`flex flex-col items-center gap-2 group/node ${containerVisible ? 'animate-fadeInUp' : ''}`}
                    style={containerVisible ? { animationDelay: `${index * 0.1}s` } : undefined}
                  >
                    <div
                      className="w-14 h-14 rounded-xl bg-surface-dark border border-border-dark flex items-center justify-center transition-all duration-300 group-hover/node:border-primary"
                      style={{
                        color: color.text,
                        boxShadow: `0 0 15px ${color.shadow.replace('0.4', '0.1')}`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 20px ${color.shadow}`;
                        e.currentTarget.style.borderColor = color.border;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 15px ${color.shadow.replace('0.4', '0.1')}`;
                        e.currentTarget.style.borderColor = '#30363d';
                      }}
                    >
                      <TechBrandIcon
                        name={tech.name}
                        className="h-8 w-8 shrink-0 opacity-90 group-hover/node:opacity-100"
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-400 group-hover/node:text-white transition-colors">
                      {tech.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
