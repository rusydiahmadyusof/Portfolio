import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useGitHub } from '../hooks/useGitHub';
import clsx from 'clsx';
import {
  checkRateLimit,
  recordSubmission,
  formatRemainingTime,
  sanitizeInput,
  isValidEmail,
  MAX_NAME_LENGTH,
  MAX_EMAIL_LENGTH,
  MAX_MESSAGE_LENGTH,
} from '../utils/security';

const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(
      MAX_NAME_LENGTH,
      `Name must be less than ${MAX_NAME_LENGTH} characters`
    ),
  email: z
    .string()
    .email('Please enter a valid email address')
    .max(
      MAX_EMAIL_LENGTH,
      `Email must be less than ${MAX_EMAIL_LENGTH} characters`
    )
    .refine((email) => isValidEmail(email), {
      message: 'Please use a valid email address',
    }),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(
      MAX_MESSAGE_LENGTH,
      `Message must be less than ${MAX_MESSAGE_LENGTH} characters`
    ),
  website: z.string().max(0, 'Bot detected'), // Honeypot
});

type ContactFormData = z.infer<typeof contactSchema>;

export const Contact = () => {
  const { user } = useGitHub();
  const githubUsername =
    import.meta.env.VITE_GITHUB_USERNAME || 'rusydiahmadyusof';

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      website: '', // Honeypot field
    },
  });

  // Check rate limit on mount
  useEffect(() => {
    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed && rateLimit.remainingTime) {
      setRateLimitError(
        `Too many submissions. Please try again in ${formatRemainingTime(
          rateLimit.remainingTime
        )}.`
      );
    }
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(false);

      // Check rate limit
      const rateLimit = checkRateLimit();
      if (!rateLimit.allowed) {
        const message = rateLimit.remainingTime
          ? `Too many submissions. Please try again in ${formatRemainingTime(
              rateLimit.remainingTime
            )}.`
          : 'Too many submissions. Please try again later.';
        setRateLimitError(message);
        return;
      }

      // Honeypot check - if filled, it's likely a bot
      if (data.website && data.website.trim().length > 0) {
        setSubmitError('Invalid submission detected.');
        return;
      }

      // Sanitize inputs (for security)
      sanitizeInput(data.name);
      sanitizeInput(data.email);
      sanitizeInput(data.message);

      recordSubmission();

      // In a real app, you would send this to your backend/API
      // Example: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(sanitizedData) })

      // Simulate API call with delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form after successful submission
      reset();
      setSubmitSuccess(true);
      setRateLimitError(null);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'An error occurred. Please try again later.'
      );
    }
  };

  return (
    <motion.section
      id='contact'
      className='min-h-screen flex items-center relative z-10'
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      <div className='container-custom w-full'>
        <motion.div
          className='text-center mb-8 md:mb-20'
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='section-title text-white'>Contact Me</h2>
          <p className='section-subtitle'>Get in touch with me</p>
        </motion.div>

        <div className='max-w-5xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8'>
            {/* Contact Form */}
            <motion.div
              className='glass rounded-xl p-5 md:p-6'
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className='mb-4'>
                <h3 className='text-xl font-bold text-white mb-1'>
                  Send a Message
                </h3>
                <p className='text-gray-400 text-xs'>
                  Fill out the form below and I'll get back to you as soon as
                  possible.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className='space-y-4'
                noValidate
              >
                {/* Honeypot field - hidden from users, traps bots */}
                <input
                  type='text'
                  {...register('website')}
                  autoComplete='off'
                  tabIndex={-1}
                  aria-hidden='true'
                  style={{
                    display: 'none',
                    position: 'absolute',
                    left: '-9999px',
                  }}
                />

                {/* Error Messages */}
                {rateLimitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='p-3 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm'
                  >
                    <div className='flex items-center gap-2'>
                      <i className='bi bi-exclamation-triangle-fill text-red-400'></i>
                      <p className='text-sm text-red-400'>{rateLimitError}</p>
                    </div>
                  </motion.div>
                )}

                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='p-3 bg-red-500/10 border border-red-500/30 rounded-lg backdrop-blur-sm'
                  >
                    <div className='flex items-center gap-2'>
                      <i className='bi bi-exclamation-triangle-fill text-red-400'></i>
                      <p className='text-sm text-red-400'>{submitError}</p>
                    </div>
                  </motion.div>
                )}

                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='p-3 bg-green-500/10 border border-green-500/30 rounded-lg backdrop-blur-sm'
                  >
                    <div className='flex items-center gap-2'>
                      <i className='bi bi-check-circle-fill text-green-400'></i>
                      <p className='text-sm text-green-400'>
                        Thank you! I'll get back to you soon.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Name Field */}
                <div className='relative'>
                  <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm'>
                    <i className='bi bi-person-fill'></i>
                  </div>
                  <input
                    id='name'
                    type='text'
                    {...register('name')}
                    className={clsx(
                      'w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all',
                      errors.name
                        ? 'border-red-500/50 focus:ring-red-500/50'
                        : 'border-white/10 focus:ring-purple-500/50 focus:border-purple-500/50 hover:border-white/20'
                    )}
                    placeholder='Your name'
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className='mt-1.5 text-xs text-red-400 flex items-center gap-1'
                    >
                      <i className='bi bi-info-circle text-xs'></i>
                      {errors.name.message}
                    </motion.p>
                  )}
                </div>

                {/* Email Field */}
                <div className='relative'>
                  <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm'>
                    <i className='bi bi-envelope-fill'></i>
                  </div>
                  <input
                    id='email'
                    type='email'
                    {...register('email')}
                    className={clsx(
                      'w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all',
                      errors.email
                        ? 'border-red-500/50 focus:ring-red-500/50'
                        : 'border-white/10 focus:ring-purple-500/50 focus:border-purple-500/50 hover:border-white/20'
                    )}
                    placeholder='your.email@example.com'
                  />
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className='mt-1.5 text-xs text-red-400 flex items-center gap-1'
                    >
                      <i className='bi bi-info-circle text-xs'></i>
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Message Field */}
                <div className='relative'>
                  <div className='absolute left-3 top-3 text-gray-400 text-sm'>
                    <i className='bi bi-chat-left-text-fill'></i>
                  </div>
                  <textarea
                    id='message'
                    {...register('message')}
                    rows={4}
                    className={clsx(
                      'w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-white/5 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none',
                      errors.message
                        ? 'border-red-500/50 focus:ring-red-500/50'
                        : 'border-white/10 focus:ring-purple-500/50 focus:border-purple-500/50 hover:border-white/20'
                    )}
                    placeholder='Tell me about your project or just say hello...'
                  />
                  {errors.message && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className='mt-1.5 text-xs text-red-400 flex items-center gap-1'
                    >
                      <i className='bi bi-info-circle text-xs'></i>
                      {errors.message.message}
                    </motion.p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={isSubmitting || !!rateLimitError}
                  className={clsx(
                    'w-full px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2',
                    isSubmitting || rateLimitError
                      ? 'bg-purple-600/30 cursor-not-allowed text-gray-400'
                      : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30'
                  )}
                >
                  {isSubmitting ? (
                    <>
                      <span className='animate-spin text-sm'>
                        <i className='bi bi-arrow-clockwise'></i>
                      </span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className='bi bi-send-fill text-sm'></i>
                      Send Message
                    </>
                  )}
                </button>

                {/* GitHub and Email buttons - Mobile only */}
                <div className='md:hidden flex gap-2 mt-4'>
                  <a
                    href={
                      user?.html_url || `https://github.com/${githubUsername}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group glass-strong rounded-lg p-2.5 hover:glass transition-all flex items-center gap-2 flex-1'
                  >
                    <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-700/20 flex items-center justify-center group-hover:from-purple-600/30 group-hover:to-purple-700/30 transition-all flex-shrink-0'>
                      <i className='bi bi-github text-base text-white'></i>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-semibold text-white text-xs'>
                        GitHub
                      </h4>
                      <p className='text-[10px] text-gray-400 truncate'>
                        @{githubUsername}
                      </p>
                    </div>
                  </a>

                  <a
                    href='mailto:dev.rusydi@gmail.com'
                    className='group glass-strong rounded-lg p-2.5 hover:glass transition-all flex items-center gap-2 flex-1'
                  >
                    <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-700/20 flex items-center justify-center group-hover:from-purple-600/30 group-hover:to-purple-700/30 transition-all flex-shrink-0'>
                      <i className='bi bi-envelope-fill text-base text-white'></i>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-semibold text-white text-xs'>
                        Email
                      </h4>
                      <p className='text-[10px] text-gray-400 truncate'>
                        Send message
                      </p>
                    </div>
                  </a>
                </div>

                {/* Security Notice */}
                <p className='text-xs text-gray-500 text-center flex items-center justify-center gap-1'>
                  <i className='bi bi-shield-check'></i>
                  Your information is secure and private
                </p>
              </form>
            </motion.div>

            {/* Contact Info & Social Links - Desktop only */}
            <motion.div
              className='hidden lg:block space-y-4'
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className='glass rounded-xl p-5 md:p-6'>
                <h3 className='text-xl font-bold text-white mb-3'>
                  Let's Connect
                </h3>
                <p className='text-gray-400 mb-4 text-sm leading-relaxed'>
                  I'm always open to discussing new projects, creative ideas, or
                  opportunities to be part of your visions.
                </p>

                <div className='space-y-2.5'>
                  <a
                    href={
                      user?.html_url || `https://github.com/${githubUsername}`
                    }
                    target='_blank'
                    rel='noopener noreferrer'
                    className='group glass-strong rounded-lg p-3 hover:glass transition-all flex items-center gap-3'
                  >
                    <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-700/20 flex items-center justify-center group-hover:from-purple-600/30 group-hover:to-purple-700/30 transition-all'>
                      <i className='bi bi-github text-lg text-white'></i>
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-semibold text-white text-sm'>
                        GitHub
                      </h4>
                      <p className='text-xs text-gray-400'>@{githubUsername}</p>
                    </div>
                    <i className='bi bi-arrow-up-right text-gray-400 group-hover:text-white transition-colors text-sm'></i>
                  </a>

                  <a
                    href='mailto:dev.rusydi@gmail.com'
                    className='group glass-strong rounded-lg p-3 hover:glass transition-all flex items-center gap-3'
                  >
                    <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/20 to-purple-700/20 flex items-center justify-center group-hover:from-purple-600/30 group-hover:to-purple-700/30 transition-all'>
                      <i className='bi bi-envelope-fill text-lg text-white'></i>
                    </div>
                    <div className='flex-1'>
                      <h4 className='font-semibold text-white text-sm'>
                        Email
                      </h4>
                      <p className='text-xs text-gray-400'>Send me a message</p>
                    </div>
                    <i className='bi bi-arrow-up-right text-gray-400 group-hover:text-white transition-colors text-sm'></i>
                  </a>
                </div>
              </div>

              <div className='glass rounded-xl p-5 md:p-6'>
                <h4 className='font-semibold text-white mb-2 text-sm flex items-center gap-2'>
                  <i className='bi bi-clock-history text-purple-400 text-sm'></i>
                  Response Time
                </h4>
                <p className='text-xs text-gray-400 leading-relaxed'>
                  I typically respond within 24-48 hours. For urgent matters,
                  please mention it in your message.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
