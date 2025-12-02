import { useEffect, useRef, useState } from 'react';
import { useGitHub } from '../hooks/useGitHub';
import { getDeploymentUrl, getTechIcon } from '../utils/githubHelpers';

export const Projects = () => {
  const { repos, loading, error, isConfigured } = useGitHub();
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (repos.length <= 1) {
      return;
    }

    let animationFrameId: number | null = null;
    let timeoutId: ReturnType<typeof setTimeout>;

    const startAutoScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) {
        return;
      }

      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) {
        return;
      }

      let scrollPosition = container.scrollLeft || 0;
      const speed = 0.5; // pixels per frame

      const animate = () => {
        if (isHoveredRef.current || !container) {
          animationFrameId = requestAnimationFrame(animate);
          return;
        }

        scrollPosition += speed;
        
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0;
        }

        container.scrollLeft = scrollPosition;
        animationFrameId = requestAnimationFrame(animate);
      };

      animationFrameId = requestAnimationFrame(animate);
    };

    // Wait for DOM to be ready
    timeoutId = setTimeout(() => {
      startAutoScroll();
    }, 200);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [repos.length]);

  if (!isConfigured) {
    return (
      <section id="projects" className="min-h-screen">
        <div className="container-custom">
          <h2 className="section-title text-center text-white">Projects</h2>
          <div className="glass rounded-2xl p-8 md:p-12 text-center">
            <p className="text-gray-400">Configure your GitHub username to see your projects.</p>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section id="projects" className="min-h-screen">
        <div className="container-custom">
          <h2 className="section-title text-center text-white">Projects</h2>
          <div className="overflow-x-auto pb-6 -mx-4 px-4 md:px-6 scrollbar-hide snap-x snap-mandatory">
            <div className="flex gap-4 md:gap-6 min-w-max">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-[320px] md:w-[360px] h-96 bg-white/10 rounded-2xl animate-pulse flex-shrink-0 snap-start"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="min-h-screen">
        <div className="container-custom">
          <h2 className="section-title text-center text-white">Projects</h2>
          <div className="glass rounded-2xl p-8 text-center">
            <p className="text-red-400 mb-4">Error: {error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  if (repos.length === 0) {
    return (
      <section id="projects" className="min-h-screen">
        <div className="container-custom">
          <h2 className="section-title text-center text-white">Projects</h2>
          <div className="glass rounded-2xl p-8 md:p-12 text-center">
            <p className="text-gray-300">No projects found after filtering.</p>
          </div>
        </div>
      </section>
    );
  }

  const getSortedTopics = (topics: string[]) => {
    const priority: Record<string, number> = { 'case-study': 1, 'featured': 2, 'ongoing': 3 };
    return [...topics].sort((a, b) => {
      return (priority[a.toLowerCase()] || 999) - (priority[b.toLowerCase()] || 999);
    });
  };

  const displayedRepos = isExpanded ? repos : repos.slice(0, 3);
  const hasMoreProjects = repos.length > 3;

  return (
    <section
      id="projects"
      className="min-h-screen flex items-center relative z-10"
    >
      <div className="container-custom w-full">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="section-title text-white">Projects</h2>
          <p className="text-sm md:text-lg text-gray-400 mb-8 md:mb-16">
            Showcasing my latest projects and creative solutions
          </p>
        </div>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-6 -mx-4 px-4 md:px-6 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { isHoveredRef.current = false; }}
          style={{ paddingTop: '8px', paddingBottom: '8px' }}
        >
          <div className="flex gap-4 md:gap-6 min-w-max py-2">
            {displayedRepos.map((repo) => {
              const description = repo.readmeDescription || repo.description;
              const deploymentUrl = getDeploymentUrl(repo);
              const sortedTopics = repo.topics ? getSortedTopics(repo.topics) : [];

              return (
                <div
                  key={repo.id}
                  className="glass rounded-xl overflow-hidden hover:glass-strong flex flex-col group relative transition-all duration-150 hover:-translate-y-2 hover:scale-[1.02] w-[280px] md:w-[360px] flex-shrink-0 snap-start"
                  style={{ transformOrigin: 'center center' }}
                >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-800/0 group-hover:from-purple-600/20 group-hover:to-purple-800/20 transition-all duration-150 pointer-events-none z-10 rounded-xl"></div>
                {repo.readmeImage && (
                  <div className="w-full h-32 md:h-40 overflow-hidden bg-white/5 relative">
                    <img
                      src={repo.readmeImage}
                      alt={repo.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent group-hover:from-slate-950/80 transition-all duration-200"></div>
                  </div>
                )}

                <div className="p-3 md:p-4 flex flex-col flex-1 relative z-20">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="text-base md:text-lg font-bold text-white flex-1 line-clamp-1">{repo.name}</h3>
                    {sortedTopics.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-end">
                        {sortedTopics.slice(0, 2).map((topic) => (
                          <span
                            key={topic}
                            className="text-[10px] md:text-xs bg-purple-600/30 text-purple-200 px-1.5 md:px-2 py-0.5 rounded whitespace-nowrap"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {description ? (
                    <p className="text-gray-300 text-[11px] md:text-xs mb-2 md:mb-3 line-clamp-2 flex-1 leading-relaxed">
                      {description}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-[11px] md:text-xs mb-2 md:mb-3 italic flex-1">
                      No description available
                    </p>
                  )}

                  {repo.readmeTechStack && repo.readmeTechStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-2 md:mb-3">
                      {repo.readmeTechStack.map((tech) => {
                        const techIcon = getTechIcon(tech);
                        return (
                          <div
                            key={tech}
                            className="flex items-center gap-1 glass-strong px-1.5 md:px-2.5 py-1 md:py-1.5 rounded-lg border border-white/20 hover:border-purple-500/50 transition-all group"
                            title={tech}
                          >
                            <img
                              src={techIcon.url}
                              alt={tech}
                              className="w-3 h-3 md:w-4 md:h-4"
                              style={{ filter: 'brightness(0) invert(1)' }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<span class="text-[10px] md:text-xs font-bold" style="color: ${techIcon.color}">${tech.charAt(0)}</span><span class="text-white text-[10px] md:text-xs ml-1">${tech}</span>`;
                                }
                              }}
                            />
                            <span className="text-white text-[10px] md:text-xs font-medium">{tech}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {(repo.stargazers_count > 0 || repo.forks_count > 0) && (
                    <div className="flex items-center gap-2 md:gap-3 mt-auto pt-2 md:pt-3 border-t border-white/10 mb-2 md:mb-3 text-[10px] md:text-xs text-gray-400">
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-0.5 md:gap-1">
                          <i className="bi bi-star-fill text-yellow-400 text-[10px] md:text-xs"></i>
                          {repo.stargazers_count}
                        </span>
                      )}
                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-0.5 md:gap-1">
                          <i className="bi bi-git-branch-fill text-[10px] md:text-xs"></i>
                          {repo.forks_count}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-1.5 md:gap-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-1.5 md:py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg text-[10px] md:text-xs font-semibold transition-all duration-150 shadow-lg shadow-purple-500/20 hover:scale-105 active:scale-95"
                    >
                      Code
                    </a>
                    {deploymentUrl && (
                      <a
                        href={deploymentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-1.5 md:py-2 glass hover:glass-strong rounded-lg text-[10px] md:text-xs font-semibold transition-all duration-150 border border-white/20 hover:border-purple-500/50 hover:scale-105 active:scale-95"
                      >
                        Live
                      </a>
                    )}
                  </div>
                </div>
                </div>
              );
            })}
            
            {/* Expand Button */}
            {!isExpanded && hasMoreProjects && (
              <button
                onClick={() => setIsExpanded(true)}
                className="glass rounded-xl overflow-hidden hover:glass-strong flex flex-col group relative transition-all duration-150 hover:-translate-y-2 hover:scale-[1.02] w-[280px] md:w-[360px] flex-shrink-0 snap-start cursor-pointer border-2 border-dashed border-white/20 hover:border-purple-500/50"
                style={{ transformOrigin: 'center center' }}
              >
                <div className="p-3 md:p-4 flex flex-col items-center justify-center h-full min-h-[400px] md:min-h-[450px] space-y-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-purple-600/20 to-purple-700/20 flex items-center justify-center group-hover:from-purple-600/30 group-hover:to-purple-700/30 transition-all">
                    <i className="bi bi-arrow-right-circle-fill text-3xl md:text-4xl text-purple-400 group-hover:text-purple-300 transition-colors"></i>
                  </div>
                  <div className="text-center">
                    <h3 className="text-base md:text-lg font-bold text-white mb-2">
                      View More Projects
                    </h3>
                    <p className="text-[11px] md:text-xs text-gray-400">
                      {repos.length - 3} more project{repos.length - 3 > 1 ? 's' : ''} available
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
