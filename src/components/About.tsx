import { useGitHub } from '../hooks/useGitHub';

export const About = () => {
  const { loading, error, isConfigured } = useGitHub();

  if (!isConfigured) {
    return (
      <section
        id='about'
        className='min-h-screen'
      >
        <div className='container-custom'>
          <h2 className='section-title text-center text-white'>About Me</h2>
          <div className='glass rounded-2xl p-8 md:p-12 text-center'>
            <p className='text-gray-400'>
              Configure your GitHub username to see your profile.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section
        id='about'
        className='min-h-screen'
      >
        <div className='container-custom'>
          <div className='space-y-4 animate-pulse'>
            <div className='h-12 bg-white/10 rounded-xl w-64 mx-auto'></div>
            <div className='h-4 bg-white/10 rounded w-full'></div>
            <div className='h-4 bg-white/10 rounded w-5/6'></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id='about'
        className='min-h-screen'
      >
        <div className='container-custom'>
          <h2 className='section-title text-center text-white'>About Me</h2>
          <div className='glass rounded-2xl p-8 text-center'>
            <p className='text-red-400 mb-4'>Error: {error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id='about'
      className='relative min-h-screen flex items-center overflow-hidden z-10'
    >
      {/* Static background elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-1/4 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-1/4 right-0 w-80 h-80 bg-purple-800/10 rounded-full blur-3xl'></div>
      </div>

      <div className='container-custom w-full relative z-10'>
        <div className='text-center mb-8 md:mb-12'>
          <h2 className='section-title text-white'>About Me</h2>
          <p className='section-subtitle'>Front End Web Developer</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
          {/* Image */}
          <div className='relative'>
            <div className='relative group'>
              {/* Decorative gradient background */}
              <div className='absolute -inset-4 bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-3xl blur-xl transition-all duration-200'></div>

              {/* Image container */}
              <div className='relative glass rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-purple-500/30 transition-all duration-150'>
                {/* Overlay to help obscure logo */}
                <div className='absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-purple-800/20 z-10 pointer-events-none'></div>
                <img
                  src='/about.jpg'
                  alt='About me'
                  className='w-full h-auto object-cover group-hover:scale-105 transition-transform duration-200 relative'
                  style={{ filter: 'brightness(0.95) contrast(1.1)' }}
                />
                {/* Decorative element to cover logo area */}
                <div className='absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-purple-600/40 to-purple-800/40 rounded-full blur-2xl z-20'></div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='space-y-4'>
            <div className='glass rounded-2xl p-6 md:p-8 relative overflow-hidden group hover:glass-strong transition-all duration-150'>
              {/* Content */}
              <div className='relative space-y-3'>
                <div>
                  <p className='text-sm md:text-base text-gray-300 leading-relaxed'>
                    <span className='text-purple-400 font-semibold'>
                      Crafting pixel-perfect, high-performance
                    </span>{' '}
                    web experiences.
                  </p>
                </div>

                <div>
                  <p className='text-sm md:text-base text-gray-300 leading-relaxed'>
                    Transforming{' '}
                    <span className='text-purple-400 font-semibold'>
                      complex designs into responsive interfaces
                    </span>{' '}
                    with modern tech.
                  </p>
                </div>

                <div>
                  <p className='text-sm md:text-base text-gray-300 leading-relaxed'>
                    Optimized for{' '}
                    <span className='text-purple-400 font-semibold'>
                      speed, accessibility, and scalability
                    </span>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
