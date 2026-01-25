import { useState, useEffect, useRef } from 'react';

interface UseTypingAnimationOptions {
  text: string;
  speed?: number;
  onComplete?: () => void;
  enabled?: boolean;
}

export const useTypingAnimation = ({
  text,
  speed = 50,
  onComplete,
  enabled = true,
}: UseTypingAnimationOptions) => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const onCompleteRef = useRef(onComplete);

  // Keep onComplete ref updated without causing re-renders
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayedText('');
      setShowCursor(false);
      return;
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let index = 0;
    setDisplayedText('');
    setShowCursor(true);

    intervalRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, ++index));
      } else {
        setShowCursor(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        onCompleteRef.current?.();
      }
    }, speed);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, speed, enabled]);

  return { displayedText, showCursor };
};

