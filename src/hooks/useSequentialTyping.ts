import { useState, useEffect, useRef } from 'react';

interface UseSequentialTypingOptions {
  messages: string[];
  typingSpeed?: number;
  pauseBetweenMessages?: number;
  enabled?: boolean;
}

export const useSequentialTyping = ({
  messages,
  typingSpeed = 50,
  pauseBetweenMessages = 800,
  enabled = true,
}: UseSequentialTypingOptions) => {
  const [displayText, setDisplayText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (!enabled || messages.length === 0) {
      setDisplayText('');
      setShowCursor(false);
      return;
    }

    let messageIndex = 0;
    let charIndex = 0;
    setDisplayText('');
    setShowCursor(true);

    const typeMessage = () => {
      if (messageIndex >= messages.length) {
        setShowCursor(false);
        return;
      }

      const currentMessage = messages[messageIndex];

      if (charIndex < currentMessage.length) {
        setDisplayText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
        timeoutRef.current = setTimeout(typeMessage, typingSpeed);
      } else {
        // Wait before next message
        timeoutRef.current = setTimeout(() => {
          messageIndex++;
          charIndex = 0;
          setDisplayText('');
          if (messageIndex < messages.length) {
            typeMessage();
          } else {
            setShowCursor(false);
          }
        }, pauseBetweenMessages);
      }
    };

    typeMessage();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [messages, typingSpeed, pauseBetweenMessages, enabled]);

  return { displayText, showCursor };
};

