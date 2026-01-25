import { useState } from 'react';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { InteractiveBackground } from './components/InteractiveBackground';
import { SplashScreen } from './components/SplashScreen';

const App = () => {
  const [splashComplete, setSplashComplete] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background-dark relative">
      <SplashScreen onComplete={() => setSplashComplete(true)} />
      <div
        className={`transition-opacity duration-1000 ease-in-out ${
          splashComplete ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <InteractiveBackground />
        <Header />
        <div className="flex flex-1 relative z-10">
          <Sidebar />
          <main className="flex-1 overflow-y-auto lg:ml-16">
            <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
              <Hero />
              <About />
              <Projects />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;
