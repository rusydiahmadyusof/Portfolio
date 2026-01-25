/**
 * Animation utility functions
 */

export const triggerGlitch = (
  setGlitchActive: (active: boolean) => void,
  duration: number = 400
): void => {
  setGlitchActive(true);
  setTimeout(() => setGlitchActive(false), duration);
};

export const createFloatingElements = (
  container: HTMLElement,
  items: readonly string[],
  className: string = 'absolute text-xs font-mono text-primary/20 pointer-events-none'
): HTMLDivElement[] => {
  const elements: HTMLDivElement[] = [];

  items.forEach((item, index) => {
    const element = document.createElement('div');
    element.className = className;
    element.textContent = item;
    element.style.left = `${Math.random() * 100}%`;
    element.style.top = `${Math.random() * 100}%`;
    element.style.animationDelay = `${index * 0.5}s`;
    element.style.animation = 'floatCode 15s infinite ease-in-out';
    container.appendChild(element);
    elements.push(element);
  });

  return elements;
};

