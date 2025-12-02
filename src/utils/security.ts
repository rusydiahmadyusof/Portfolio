/**
 * Security utilities for form protection
 */

// Rate limiting: Track submissions per IP/session
const RATE_LIMIT_KEY = 'contact_form_submissions';
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_SUBMISSIONS_PER_WINDOW = 3;

export const checkRateLimit = (): { allowed: boolean; remainingTime?: number } => {
  if (typeof window === 'undefined') return { allowed: true };

  const now = Date.now();
  const submissions = JSON.parse(
    sessionStorage.getItem(RATE_LIMIT_KEY) || '[]'
  ) as number[];

  // Filter out old submissions outside the window
  const recentSubmissions = submissions.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    const oldestSubmission = Math.min(...recentSubmissions);
    const remainingTime = RATE_LIMIT_WINDOW - (now - oldestSubmission);
    return { allowed: false, remainingTime };
  }

  return { allowed: true };
};

export const recordSubmission = (): void => {
  if (typeof window === 'undefined') return;

  const now = Date.now();
  const submissions = JSON.parse(
    sessionStorage.getItem(RATE_LIMIT_KEY) || '[]'
  ) as number[];

  submissions.push(now);
  sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(submissions));
};

export const formatRemainingTime = (ms: number): string => {
  const minutes = Math.ceil(ms / 60000);
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

// Email validation with domain checks
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
  'temp-mail.org',
  'getnada.com',
  'mohmal.com',
  'yopmail.com',
  'sharklasers.com',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'bccto.me',
  'chacuo.net',
  'dispostable.com',
  'meltmail.com',
  'emailondeck.com',
  'fakeinbox.com',
  'mintemail.com',
  'mytrashmail.com',
  'tempail.com',
  'trashmail.com',
  'trashmailer.com',
  'throwawaymail.com',
  // Add more as needed
];

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;

  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;

  // Check against disposable email domains
  if (DISPOSABLE_EMAIL_DOMAINS.some((d) => domain.includes(d))) {
    return false;
  }

  return true;
};

// Content length limits
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254; // RFC 5321
export const MAX_MESSAGE_LENGTH = 2000;


// URL validation and sanitization
export const sanitizeUrl = (url: string): string | null => {
  if (!url || typeof url !== 'string') return null;

  try {
    // Remove dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:'];
    const lowerUrl = url.toLowerCase().trim();

    if (dangerousProtocols.some((protocol) => lowerUrl.startsWith(protocol))) {
      return null;
    }

    // Validate URL format
    const urlObj = new URL(url);
    
    // Only allow http and https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return null;
    }

    return urlObj.toString();
  } catch {
    // If URL parsing fails, try to construct a safe URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url.trim();
    }
    return null;
  }
};

// Validate and sanitize GitHub URLs specifically
export const validateGitHubUrl = (url: string): boolean => {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return (
      ['http:', 'https:'].includes(urlObj.protocol) &&
      (urlObj.hostname === 'github.com' ||
        urlObj.hostname === 'www.github.com' ||
        urlObj.hostname.endsWith('.github.io'))
    );
  } catch {
    return false;
  }
};

