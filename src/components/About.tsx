import { useGitHub } from '../hooks/useGitHub';
import { TerminalWindow } from './TerminalWindow';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { TechBrandIcon } from './TechBrandIcon';
import { getTechColor } from '../utils/techHelpers';
import { DISPLAY_LIMITS } from '../utils/constants';

export const About = () => {
  const { user, techStack, loading, error, isConfigured } = useGitHub();
  const { ref: terminalRef, isVisible: terminalVisible } = useScrollAnimation();
  const { ref: techRef, isVisible: techVisible } = useScrollAnimation();

  if (!isConfigured) {
    return (
      <section id="about" className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
            <span className="material-symbols-outlined text-secondary">terminal</span>
            // ABOUT_ME.CONFIG
          </h3>
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-gray-400">Configure your GitHub username to see your profile.</p>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section id="about" className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-12 bg-white/10 rounded-xl w-64"></div>
            <div className="h-4 bg-white/10 rounded w-full"></div>
            <div className="h-4 bg-white/10 rounded w-5/6"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="about" className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
            <span className="material-symbols-outlined text-secondary">terminal</span>
            // ABOUT_ME.CONFIG
          </h3>
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-red-400 mb-4">Error: {error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  const name = user?.name || 'Rusydi Ahmad Yusof';
  const role = 'Full Stack Web Developer';
  const location = user?.location || 'Malaysia';
  const interests = ['React', 'TypeScript', 'Node.js', 'Full-Stack Development'];
  const tagline = 'I build full-stack web apps with React, TypeScript, and Node.';
  const lookingFor = 'Open to full-stack opportunities.';

  return (
    <section id="about" className="relative min-h-screen flex items-center overflow-hidden z-10 py-12">
      <div className="max-w-7xl mx-auto p-4 md:p-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Terminal Window */}
          <div ref={terminalRef} className={`lg:col-span-7 flex flex-col ${terminalVisible ? 'animate-fadeInLeft' : ''}`}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
              <span className="material-symbols-outlined text-secondary">terminal</span>
              // ABOUT_ME.CONFIG
            </h3>
            <TerminalWindow>
              <div className="flex gap-2 mb-4 text-slate-400">
                <span>$</span>
                <span className="text-white">cat</span>
                <span>profile.json</span>
              </div>
              <div className="space-y-1">
                <div className="pl-0 text-white">{'{'}</div>
                <div className="pl-4">
                  <span className="code-syntax-key">"name"</span>: <span className="code-syntax-string">"{name}"</span>,
                </div>
                <div className="pl-4">
                  <span className="code-syntax-key">"role"</span>: <span className="code-syntax-string">"{role}"</span>,
                </div>
                <div className="pl-4">
                  <span className="code-syntax-key">"location"</span>: <span className="code-syntax-string">"{location}"</span>,
                </div>
                <div className="pl-4">
                  <span className="code-syntax-key">"status"</span>: <span className="code-syntax-string">"Building the future"</span>,
                </div>
                <div className="pl-4">
                  <span className="code-syntax-key">"interests"</span>: [
                </div>
                <div className="pl-8">
                  {interests.map((interest, index) => (
                    <span key={interest}>
                      <span className="code-syntax-string">"{interest}"</span>
                      {index < interests.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
                <div className="pl-4">],</div>
                <div className="pl-4">
                  <span className="code-syntax-key">"tagline"</span>: <span className="code-syntax-string">"{tagline}"</span>,
                </div>
                <div className="pl-4">
                  <span className="code-syntax-key">"lookingFor"</span>: <span className="code-syntax-string">"{lookingFor}"</span>,
                </div>
                <div className="pl-4">
                  <span className="code-syntax-key">"mission"</span>: <span className="code-syntax-string">"To create immersive web experiences that blur the line between utility and art."</span>
                </div>
                <div className="pl-0 text-white">{'}'}</div>
              </div>
            </TerminalWindow>
          </div>

          {/* Tech Stack Section */}
          <div ref={techRef} className={`lg:col-span-5 flex flex-col ${techVisible ? 'animate-fadeInRight' : ''}`}>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
              <span className="material-symbols-outlined text-primary">hub</span>
              // TECH_STACK.NET
            </h3>
            {techStack && techStack.length > 0 ? (
              <div className="flex-1 rounded-lg border border-border-dark bg-background-dark p-6 relative overflow-hidden group">
                {/* Circuit Lines Background */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'radial-gradient(#25e2f4 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                  }}
                ></div>
                <div className="grid grid-cols-4 gap-6 relative z-10 h-full content-center">
                  {techStack.slice(0, DISPLAY_LIMITS.TECH_STACK).map((tech, index) => {
                    const color = getTechColor(tech.name);
                    return (
                      <div 
                        key={tech.name} 
                        className={`flex flex-col items-center gap-2 group/node ${techVisible ? 'animate-fadeInUp' : ''}`}
                        style={techVisible ? { animationDelay: `${index * 0.1}s` } : undefined}
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
            ) : (
              <div className="flex-1 rounded-lg border border-border-dark bg-background-dark p-6 flex items-center justify-center">
                <p className="text-slate-400 text-sm">No technologies detected yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
