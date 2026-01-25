import { useState, useEffect } from 'react';
import { scrollToSection } from '../utils/scroll';

const navItems = [
  { id: 'hero', label: 'Home', icon: 'folder_open' },
  { id: 'about', label: 'About', icon: 'search' },
  { id: 'projects', label: 'Projects', icon: 'troubleshoot' },
];

export const Sidebar = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    // Wait for DOM to be ready
    const timeout = setTimeout(() => {
      const main = document.querySelector('main');
      if (!main) return;

      const handleScroll = () => {
        try {
          const centerY = main.scrollTop + main.clientHeight / 2;

          for (let i = navItems.length - 1; i >= 0; i--) {
            const element = document.getElementById(navItems[i].id);
            if (element) {
              const rect = element.getBoundingClientRect();
              const mainRect = main.getBoundingClientRect();
              const elementTop = rect.top - mainRect.top + main.scrollTop;

              if (elementTop <= centerY) {
                setActiveSection(navItems[i].id);
                break;
              }
            }
          }
        } catch (err) {
          // Silently handle any scroll detection errors
        }
      };

      main.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      
      cleanup = () => {
        main.removeEventListener('scroll', handleScroll);
      };
    }, 100);

    return () => {
      clearTimeout(timeout);
      cleanup?.();
    };
  }, []);

  return (
    <aside className="hidden lg:flex w-16 flex-col items-center border-r border-border-dark bg-surface-dark py-4 gap-6 fixed left-0 top-14 h-[calc(100vh-3.5rem)] z-30">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => {
            scrollToSection(item.id);
            setActiveSection(item.id);
          }}
          className={`w-10 h-10 flex items-center justify-center rounded transition-colors ${
            activeSection === item.id
              ? 'text-primary bg-primary/10 border-l-2 border-primary'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          aria-label={item.label}
          title={item.label}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
        </button>
      ))}
    </aside>
  );
};
