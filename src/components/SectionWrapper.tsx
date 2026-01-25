import { ReactNode } from 'react';
import { useGitHub } from '../hooks/useGitHub';

interface SectionWrapperProps {
  id: string;
  title: string;
  icon: string;
  children: ReactNode;
  loadingComponent?: ReactNode;
  errorComponent?: ReactNode;
  notConfiguredComponent?: ReactNode;
}

export const SectionWrapper = ({
  id,
  title,
  icon,
  children,
  loadingComponent,
  errorComponent,
  notConfiguredComponent,
}: SectionWrapperProps) => {
  const { loading, error, isConfigured } = useGitHub();

  if (!isConfigured) {
    return (
      <section id={id} className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
            <span className="material-symbols-outlined text-primary">{icon}</span>
            {title}
          </h3>
          {notConfiguredComponent || (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-gray-400">Configure your GitHub username to see this section.</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section id={id} className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
            <span className="material-symbols-outlined text-primary">{icon}</span>
            {title}
          </h3>
          {loadingComponent || (
            <div className="space-y-4 animate-pulse">
              <div className="h-12 bg-white/10 rounded-xl w-64"></div>
              <div className="h-4 bg-white/10 rounded w-full"></div>
            </div>
          )}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id={id} className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 font-display">
            <span className="material-symbols-outlined text-primary">{icon}</span>
            {title}
          </h3>
          {errorComponent || (
            <div className="glass rounded-2xl p-8 text-center">
              <p className="text-red-400 mb-4">Error: {error.message}</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  return <>{children}</>;
};

