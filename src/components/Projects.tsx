import { useEffect, useRef, useState } from 'react';
import { useGitHub } from '../hooks/useGitHub';
import { getDeploymentUrl } from '../utils/githubHelpers';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { PROJECT_STATUS, VERSIONS, DISPLAY_LIMITS, PROJECT_DESCRIPTIONS } from '../utils/constants';

const getStatus = (topics: string[] = []): { label: string; color: string; pulse: boolean } => {
  if (topics.includes('live') || topics.includes('deployed')) {
    return PROJECT_STATUS.LIVE;
  }
  if (topics.includes('beta') || topics.includes('ongoing')) {
    return PROJECT_STATUS.BETA;
  }
  return PROJECT_STATUS.LIVE;
};

const getVersion = (): string => {
  return VERSIONS[Math.floor(Math.random() * VERSIONS.length)];
};

const getHash = (id: number): string => {
  return id.toString(16).slice(0, 6);
};

export const Projects = () => {
  const { repos, loading, error, isConfigured } = useGitHub();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { ref: sectionRef, isVisible: sectionVisible } = useScrollAnimation();

  useEffect(() => {
    if (repos.length <= 1) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    let frameId: number | undefined;
    let position = 0;
    const speed = 0.5;
    let isRunning = true;

    const animate = () => {
      if (!isRunning || !container) return;
      
      if (isHoveredRef.current) {
        frameId = requestAnimationFrame(animate);
        return;
      }

      try {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if (maxScroll > 0) {
          position = (position + speed) % maxScroll;
          container.scrollLeft = position;
        }
        frameId = requestAnimationFrame(animate);
      } catch (err) {
        // Stop animation on error
        isRunning = false;
      }
    };

    const timeout = setTimeout(() => {
      if (container && isRunning) {
        frameId = requestAnimationFrame(animate);
      }
    }, 200);

    return () => {
      isRunning = false;
      clearTimeout(timeout);
      if (frameId !== undefined) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [repos.length]);

  if (!isConfigured) {
    return (
      <section id="projects" className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
            <span className="material-symbols-outlined text-primary">rocket_launch</span>
            // DEPLOYMENTS_LOG
          </h3>
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-gray-400">Configure your GitHub username to see your projects.</p>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section id="projects" className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
            <span className="material-symbols-outlined text-primary">rocket_launch</span>
            // DEPLOYMENTS_LOG
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-white/10 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
            <span className="material-symbols-outlined text-primary">rocket_launch</span>
            // DEPLOYMENTS_LOG
          </h3>
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-red-400 mb-4">Error: {error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  if (repos.length === 0) {
    return (
      <section id="projects" className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
            <span className="material-symbols-outlined text-primary">rocket_launch</span>
            // DEPLOYMENTS_LOG
          </h3>
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-gray-300">No projects found after filtering.</p>
          </div>
        </div>
      </section>
    );
  }

  const displayedRepos = isExpanded ? repos : repos.slice(0, DISPLAY_LIMITS.INITIAL_PROJECTS);
  const hasMoreProjects = repos.length > DISPLAY_LIMITS.INITIAL_PROJECTS;

  return (
    <section id="projects" className="relative min-h-screen flex items-center overflow-hidden z-10 py-12">
      <div className="max-w-7xl mx-auto p-4 md:p-8 w-full">
        <div className={`flex items-center justify-between mb-6 ${sectionVisible ? 'animate-fadeInUp' : ''}`}>
          <h3 className="text-xl font-bold text-white flex items-center gap-2 font-display">
            <span className="material-symbols-outlined text-primary">rocket_launch</span>
            // DEPLOYMENTS_LOG
          </h3>
          <div className="hidden md:flex gap-2">
            <button className="px-3 py-1 text-xs font-mono rounded bg-surface-dark text-slate-400 border border-border-dark hover:text-white hover:border-primary transition-colors">
              All
            </button>
            <button className="px-3 py-1 text-xs font-mono rounded bg-surface-dark text-slate-400 border border-border-dark hover:text-white hover:border-primary transition-colors">
              Live
            </button>
            <button className="px-3 py-1 text-xs font-mono rounded bg-surface-dark text-slate-400 border border-border-dark hover:text-white hover:border-primary transition-colors">
              Beta
            </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-6 -mx-4 px-4 md:px-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { isHoveredRef.current = false; }}
          style={{ paddingTop: '8px', paddingBottom: '8px' }}
        >
          <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-max md:min-w-0">
            {displayedRepos.map((repo, index) => {
              const description =
                PROJECT_DESCRIPTIONS[repo.name] ?? repo.readmeDescription ?? repo.description ?? 'A project I built.';
              const deploymentUrl = getDeploymentUrl(repo);
              const status = getStatus(repo.topics);
              const version = getVersion();
              const hash = getHash(repo.id);

              return (
                <div
                  key={repo.id}
                  className={`group relative rounded-xl border border-border-dark bg-surface-dark overflow-hidden hover:border-primary/50 transition-colors duration-300 w-[320px] md:w-full flex-shrink-0 md:flex-shrink snap-start ${sectionVisible ? 'animate-fadeInUp' : ''}`}
                  style={sectionVisible ? { animationDelay: `${index * 0.1}s` } : undefined}
                >
                  {/* Status Bar */}
                  <div className="flex items-center justify-between px-4 py-2 bg-background-dark/50 border-b border-border-dark text-xs font-mono">
                    <span className="flex items-center gap-1.5" style={{ color: status.color }}>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${status.pulse ? 'animate-pulse' : ''}`}
                        style={{ backgroundColor: status.color }}
                      ></span>
                      {status.label}
                    </span>
                    <span className="text-slate-500">v.{version}</span>
                  </div>

                  {/* Image */}
                  {repo.readmeImage && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        alt={repo.name}
                        src={repo.readmeImage}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (target) {
                            target.style.display = 'none';
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent opacity-80"></div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4 relative">
                    <h4 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors font-display">
                      {repo.name}
                    </h4>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                      {description || 'No description available'}
                    </p>

                    {/* Tech Stack Tags */}
                    {repo.readmeTechStack && repo.readmeTechStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {repo.readmeTechStack.slice(0, 3).map((tech) => {
                          const techColors: Record<string, { bg: string; text: string; border: string }> = {
                            'React': { bg: 'rgba(59, 130, 246, 0.1)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.2)' },
                            'TypeScript': { bg: 'rgba(168, 85, 247, 0.1)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.2)' },
                            'JavaScript': { bg: 'rgba(234, 179, 8, 0.1)', text: '#fbbf24', border: 'rgba(234, 179, 8, 0.2)' },
                            'Node.js': { bg: 'rgba(16, 185, 129, 0.1)', text: '#34d399', border: 'rgba(16, 185, 129, 0.2)' },
                            'Tailwind': { bg: 'rgba(6, 182, 212, 0.1)', text: '#22d3ee', border: 'rgba(6, 182, 212, 0.2)' },
                          };
                          const color = techColors[tech] || { bg: 'rgba(100, 116, 139, 0.1)', text: '#94a3b8', border: 'rgba(100, 116, 139, 0.2)' };
                          return (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded text-[10px] font-mono border"
                              style={{
                                backgroundColor: color.bg,
                                color: color.text,
                                borderColor: color.border,
                              }}
                            >
                              {tech}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Footer with Hash and Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-border-dark">
                      <span className="text-xs font-mono text-slate-500">Hash: {hash}</span>
                      <div className="flex gap-2">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white transition-colors"
                          title="View Code"
                        >
                          <span className="material-symbols-outlined text-lg">code</span>
                        </a>
                        {deploymentUrl && (
                          <a
                            href={deploymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-primary transition-colors"
                            title="Launch"
                          >
                            <span className="material-symbols-outlined text-lg">open_in_new</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Expand Button */}
            {!isExpanded && hasMoreProjects && (
              <button
                onClick={() => setIsExpanded(true)}
                className="group relative rounded-xl border-2 border-dashed border-border-dark bg-surface-dark overflow-hidden hover:border-primary/50 transition-colors duration-300 w-[320px] md:w-full flex-shrink-0 md:flex-shrink snap-start cursor-pointer"
              >
                <div className="p-4 flex flex-col items-center justify-center h-full min-h-[400px] space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-secondary/30 transition-all">
                    <span className="material-symbols-outlined text-4xl text-primary">expand_more</span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white mb-2 font-display">
                      View More Projects
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {repos.length - DISPLAY_LIMITS.INITIAL_PROJECTS} more project{repos.length - DISPLAY_LIMITS.INITIAL_PROJECTS > 1 ? 's' : ''} available
                    </p>
                  </div>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
