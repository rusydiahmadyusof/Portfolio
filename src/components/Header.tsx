import { useState, useEffect, useRef } from 'react';
import { useGitHub } from '../hooks/useGitHub';
import { CommandPalette } from './CommandPalette';
import { QuickMenu } from './QuickMenu';

export const Header = () => {
  const { user } = useGitHub();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const [isProjectsMenuOpen, setIsProjectsMenuOpen] = useState(false);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const projectsButtonRef = useRef<HTMLButtonElement>(null);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  // Keyboard shortcut: ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-dark bg-surface-dark/80 backdrop-blur-md">
      <div className="px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-primary font-bold text-lg tracking-tight flex items-center gap-1 font-display">
            <span className="material-symbols-outlined text-[20px]">terminal</span>
            <span>&lt;DevConsole /&gt;</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="px-2 py-0.5 rounded bg-background-dark border border-border-dark">master*</span>
            <span className="px-2 py-0.5 rounded bg-background-dark border border-border-dark flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              ONLINE
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden md:flex group items-center gap-3 px-4 py-1.5 bg-background-dark border border-border-dark rounded-full text-sm text-slate-400 hover:border-primary/50 transition-colors w-96 justify-between"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span className="group-hover:text-primary transition-colors">Find command...</span>
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded bg-border-dark text-slate-300">⌘K</span>
        </button>

        <button className="md:hidden p-2 text-slate-400 hover:text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-3 border-r border-border-dark pr-4 relative">
            <button
              ref={settingsButtonRef}
              onClick={() => {
                setIsSettingsMenuOpen((prev) => !prev);
                setIsProjectsMenuOpen(false);
              }}
              className={`text-slate-400 hover:text-primary transition-colors relative ${
                isSettingsMenuOpen ? 'text-primary' : ''
              }`}
              aria-label="Settings"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button
              ref={projectsButtonRef}
              onClick={() => {
                setIsProjectsMenuOpen((prev) => !prev);
                setIsSettingsMenuOpen(false);
              }}
              className={`text-slate-400 hover:text-primary transition-colors relative ${
                isProjectsMenuOpen ? 'text-primary' : ''
              }`}
              aria-label="Projects"
            >
              <span className="material-symbols-outlined">rocket_launch</span>
            </button>
            
            <QuickMenu
              isOpen={isSettingsMenuOpen}
              onClose={() => setIsSettingsMenuOpen(false)}
              anchorRef={settingsButtonRef}
              type="settings"
            />
            <QuickMenu
              isOpen={isProjectsMenuOpen}
              onClose={() => setIsProjectsMenuOpen(false)}
              anchorRef={projectsButtonRef}
              type="projects"
            />
          </div>
          {user?.avatar_url ? (
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/30 hover:border-primary transition-colors">
              <img
                src={user.avatar_url}
                alt={user.name || 'User avatar'}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background-dark font-bold text-xs">
              {initials}
            </div>
          )}
        </div>
      </div>
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </header>
  );
};
