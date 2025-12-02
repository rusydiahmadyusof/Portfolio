import { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home', icon: 'bi-house-fill' },
  { id: 'about', label: 'About', icon: 'bi-person-fill' },
  { id: 'tech-stack', label: 'Tech', icon: 'bi-code-slash' },
  { id: 'projects', label: 'Projects', icon: 'bi-rocket-fill' },
  { id: 'contact', label: 'Contact', icon: 'bi-envelope-fill' },
];

export const Navigation = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + window.innerHeight / 2;

      for (let i = navItems.length - 1; i >= 0; i--) {
        const element = document.getElementById(navItems[i].id);
        if (element && element.offsetTop <= scrollY) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setActiveSection(sectionId);
    }
  };

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl border border-white/20">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative flex items-center justify-center transition-all duration-300 ease-out hover:scale-150 hover:-translate-y-3"
                style={{
                  transform: isActive ? 'translateY(-8px) scale(1.2)' : undefined,
                }}
                aria-label={item.label}
                title={item.label}
              >
                <div
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                    ${
                      isActive
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                        : 'text-gray-300 hover:text-white'
                    }
                  `}
                >
                  <i className={`bi ${item.icon} text-xl`}></i>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
