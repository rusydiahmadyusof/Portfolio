import { useEffect, useRef } from 'react';
import { useGitHub } from '../hooks/useGitHub';
import { scrollToSection } from '../utils/scroll';
import { DISPLAY_LIMITS } from '../utils/constants';

interface QuickMenuProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  type: 'settings' | 'projects';
}

export const QuickMenu = ({ isOpen, onClose, anchorRef, type }: QuickMenuProps) => {
  const { user, repos } = useGitHub();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, anchorRef]);

  useEffect(() => {
    if (isOpen && menuRef.current && anchorRef.current) {
      const anchorRect = anchorRef.current.getBoundingClientRect();
      const menu = menuRef.current;
      
      // Position menu below the button
      menu.style.top = `${anchorRect.bottom + 8}px`;
      menu.style.right = `${window.innerWidth - anchorRect.right}px`;
    }
  }, [isOpen, anchorRef]);

  if (!isOpen) return null;

  if (type === 'settings') {
    return (
      <div
        ref={menuRef}
        className="fixed z-50 w-56 bg-background-dark border border-border-dark rounded-lg shadow-2xl overflow-hidden animate-scaleIn"
      >
        <div className="py-2">
          <button
            onClick={() => {
              scrollToSection('about');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-slate-300 hover:bg-surface-dark hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-xl">person</span>
            <span>About Me</span>
          </button>
          
          {user?.html_url && (
            <>
              <button
                onClick={() => {
                  window.open(user.html_url, '_blank', 'noopener,noreferrer');
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-slate-300 hover:bg-surface-dark hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-xl">code</span>
                <span>GitHub Profile</span>
              </button>
              <button
                onClick={async () => {
                  try {
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                      await navigator.clipboard.writeText(user.html_url);
                    } else {
                      // Fallback for older browsers
                      const textArea = document.createElement('textarea');
                      textArea.value = user.html_url;
                      textArea.style.position = 'fixed';
                      textArea.style.opacity = '0';
                      document.body.appendChild(textArea);
                      textArea.select();
                      document.execCommand('copy');
                      document.body.removeChild(textArea);
                    }
                  } catch (err) {
                    console.error('Failed to copy:', err);
                  }
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-slate-300 hover:bg-surface-dark hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-xl">link</span>
                <span>Copy Profile Link</span>
              </button>
            </>
          )}
          
          <div className="border-t border-border-dark my-1"></div>
          
          <button
            onClick={() => {
              window.open('https://github.com', '_blank', 'noopener,noreferrer');
              onClose();
            }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-slate-300 hover:bg-surface-dark hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-xl">info</span>
            <span>About This Site</span>
          </button>
        </div>
      </div>
    );
  }

  // Projects menu
  const projectCount = repos?.length || 0;
  const featuredProjects = repos?.filter((repo) => 
    repo.topics?.includes('featured') || repo.topics?.includes('portfolio')
  ) || [];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-64 bg-background-dark border border-border-dark rounded-lg shadow-2xl overflow-hidden animate-scaleIn"
    >
      <div className="py-2">
        <button
          onClick={() => {
            scrollToSection('projects');
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-slate-300 hover:bg-surface-dark hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-xl">rocket_launch</span>
          <span>View All Projects</span>
        </button>
        
        <div className="border-t border-border-dark my-1"></div>
        
        <div className="px-4 py-2">
          <div className="text-xs text-slate-500 mb-2">Quick Stats</div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Total Projects</span>
              <span className="text-primary font-mono font-bold">{projectCount}</span>
            </div>
            {featuredProjects.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Featured</span>
                <span className="text-secondary font-mono font-bold">{featuredProjects.length}</span>
              </div>
            )}
          </div>
        </div>

        {featuredProjects.length > 0 && (
          <>
            <div className="border-t border-border-dark my-1"></div>
            <div className="px-4 py-2">
              <div className="text-xs text-slate-500 mb-2">Featured Projects</div>
              <div className="space-y-1">
                {featuredProjects.slice(0, DISPLAY_LIMITS.FEATURED_PROJECTS).map((repo) => (
                  <button
                    key={repo.id}
                    onClick={() => {
                      window.open(repo.html_url, '_blank', 'noopener,noreferrer');
                      onClose();
                    }}
                    className="w-full text-left px-2 py-1.5 rounded text-sm text-slate-400 hover:bg-surface-dark hover:text-white transition-colors truncate"
                    title={repo.name}
                  >
                    <span className="material-symbols-outlined text-base align-middle mr-1.5">folder</span>
                    {repo.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

