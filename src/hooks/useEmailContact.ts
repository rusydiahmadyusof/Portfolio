import { useState } from 'react';

const EMAIL = 'dev.rusydi@gmail.com';
const EMAIL_SUBJECT = 'Portfolio Contact';

// Spam protection constants
const RATE_LIMIT_KEY = 'contact_button_usage';
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_CLICKS_PER_WINDOW = 3;
const COOLDOWN_PERIOD = 2000; // 2 seconds between clicks

interface RateLimitResult {
  allowed: boolean;
  remainingTime?: number;
  message?: string;
}

const checkRateLimit = (): RateLimitResult => {
  if (typeof window === 'undefined') return { allowed: true };

  const now = Date.now();
  const usage = JSON.parse(
    sessionStorage.getItem(RATE_LIMIT_KEY) || '[]'
  ) as number[];

  // Filter out old clicks outside the window
  const recentClicks = usage.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (recentClicks.length >= MAX_CLICKS_PER_WINDOW) {
    const oldestClick = Math.min(...recentClicks);
    const remainingTime = RATE_LIMIT_WINDOW - (now - oldestClick);
    const minutes = Math.ceil(remainingTime / 60000);
    return {
      allowed: false,
      remainingTime,
      message: `Please wait ${minutes} minute${minutes !== 1 ? 's' : ''} before trying again.`,
    };
  }

  // Check cooldown (last click must be at least COOLDOWN_PERIOD ago)
  if (recentClicks.length > 0) {
    const lastClick = Math.max(...recentClicks);
    const timeSinceLastClick = now - lastClick;
    if (timeSinceLastClick < COOLDOWN_PERIOD) {
      const remainingCooldown = COOLDOWN_PERIOD - timeSinceLastClick;
      return {
        allowed: false,
        remainingTime: remainingCooldown,
        message: 'Please wait a moment before trying again.',
      };
    }
  }

  return { allowed: true };
};

const recordClick = (): void => {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const usage = JSON.parse(
    sessionStorage.getItem(RATE_LIMIT_KEY) || '[]'
  ) as number[];

  usage.push(now);
  sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(usage));
};

export const useEmailContact = () => {
  const [emailCopied, setEmailCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleContact = async () => {
    // Check rate limit
    const rateLimitCheck = checkRateLimit();
    if (!rateLimitCheck.allowed) {
      setErrorMessage(rateLimitCheck.message || 'Too many requests. Please try again later.');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Record the click
      recordClick();

      // Try to open mailto link
      const link = document.createElement('a');
      link.href = `mailto:${EMAIL}?subject=${encodeURIComponent(EMAIL_SUBJECT)}`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Fallback: copy to clipboard if mailto doesn't work
      setTimeout(async () => {
        try {
          await navigator.clipboard.writeText(EMAIL);
          setEmailCopied(true);
          setTimeout(() => setEmailCopied(false), 2000);
        } catch (err) {
          // Clipboard API not available, show email in alert
          alert(`Email: ${EMAIL}`);
        }
        setIsProcessing(false);
      }, 100);
    } catch (err) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(EMAIL);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
      } catch (clipboardErr) {
        alert(`Email: ${EMAIL}`);
      }
      setIsProcessing(false);
    }
  };

  return {
    emailCopied,
    errorMessage,
    isProcessing,
    handleContact,
    email: EMAIL,
  };
};

