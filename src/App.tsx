import { Hero } from './components/Hero';
import { About } from './components/About';
import { TechStack } from './components/TechStack';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Navigation } from './components/Navigation';

const App = () => {
  return (
    <div className="relative min-h-screen w-full">
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Contact />
      <Navigation />
    </div>
  );
};

export default App;

