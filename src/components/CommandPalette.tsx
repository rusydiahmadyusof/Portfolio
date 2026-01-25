import { useEffect, useRef, useState } from 'react';
import { useGitHub } from '../hooks/useGitHub';
import { scrollToSection } from '../utils/scroll';

interface Command {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  shortcut?: string;
  category: 'navigation' | 'external';
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const { user } = useGitHub();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: Command[] = [
    {
      id: 'home',
      label: 'Go to Home',
      icon: 'home',
      action: () => {
        scrollToSection('hero');
        onClose();
      },
      category: 'navigation',
    },
    {
      id: 'about',
      label: 'Go to About',
      icon: 'person',
      action: () => {
        scrollToSection('about');
        onClose();
      },
      category: 'navigation',
    },
    {
      id: 'projects',
      label: 'Go to Projects',
      icon: 'rocket_launch',
      action: () => {
        scrollToSection('projects');
        onClose();
      },
      category: 'navigation',
    },
    ...(user?.html_url
      ? [
          {
            id: 'github',
            label: 'Open GitHub Profile',
            icon: 'code',
            action: () => {
              window.open(user.html_url, '_blank', 'noopener,noreferrer');
              onClose();
            },
            category: 'external' as const,
            shortcut: 'G',
          },
        ]
      : []),
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Command Palette Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4 pointer-events-none">
        <div
          className="w-full max-w-2xl bg-background-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden pointer-events-auto animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border-dark">
            <span className="material-symbols-outlined text-slate-400">search</span>
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none font-mono text-sm"
            />
            <kbd className="hidden md:flex items-center gap-1 px-2 py-1 rounded bg-surface-dark border border-border-dark text-xs text-slate-400 font-mono">
              <span>ESC</span>
            </kbd>
          </div>

          {/* Commands List */}
          <div
            ref={listRef}
            className="max-h-96 overflow-y-auto"
          >
            {filteredCommands.length > 0 ? (
              <div className="py-2">
                {filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={command.action}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      index === selectedIndex
                        ? 'bg-primary/10 text-primary border-l-2 border-primary'
                        : 'text-slate-300 hover:bg-surface-dark hover:text-white'
                    }`}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span className="material-symbols-outlined text-xl">{command.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{command.label}</div>
                      {command.category === 'external' && (
                        <div className="text-xs text-slate-500 mt-0.5">Opens in new tab</div>
                      )}
                    </div>
                    {command.shortcut && (
                      <kbd className="px-2 py-1 rounded bg-surface-dark border border-border-dark text-xs text-slate-400 font-mono">
                        {command.shortcut}
                      </kbd>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500">
                <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
                <p>No commands found</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border-dark bg-surface-dark/50 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-background-dark border border-border-dark">↑</kbd>
                <kbd className="px-1.5 py-0.5 rounded bg-background-dark border border-border-dark">↓</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-background-dark border border-border-dark">↵</kbd>
                <span>Select</span>
              </div>
            </div>
            <div className="text-slate-400 font-mono">
              {filteredCommands.length} {filteredCommands.length === 1 ? 'result' : 'results'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

