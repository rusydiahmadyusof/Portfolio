import { useEffect, useRef, useState } from 'react';

const defaultOptions = { threshold: 0.1, rootMargin: '0px' };

export const useScrollAnimation = (options = defaultOptions) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      setIsVisible(true);
      return;
    }

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    try {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries && entries.length > 0) {
            const entry = entries[0];
            if (entry?.isIntersecting) {
              setIsVisible(true);
            }
          }
        },
        options
      );

      observer.observe(element);
      return () => {
        observer.disconnect();
      };
    } catch (err) {
      // Fallback: show element immediately if IntersectionObserver fails
      setIsVisible(true);
    }
  }, []);

  return { ref, isVisible };
};

