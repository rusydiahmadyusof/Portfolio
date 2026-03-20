// Animation constants
export const ANIMATION_DELAYS = {
  STATUS_TYPING: 50,
  DESCRIPTION_TYPING: 30,
  GLITCH_DURATION: 400,
  HEADING_CHANGE_DELAY: 1500,
  STATUS_TO_DESCRIPTION_DELAY: 800,
} as const;

// Content constants
export const STATUS_TEXT = 'SYSTEM READY // V.2.0.4';

export interface ContentVariant {
  heading: { line1: string; line2: string };
  description: string;
}

export const CONTENT_VARIANTS: ContentVariant[] = [
  {
    heading: { line1: 'Building Modern', line2: 'Web Solutions' },
    description: 'Building scalable solutions...\nReact ecosystem optimized.\nTransforming ideas into interactive digital experiences.',
  },
  {
    heading: { line1: 'Crafting Digital', line2: 'Experiences' },
    description: 'Initializing user interface...\nFull-stack environment loaded.\nExploring creative frontiers through clean code and modern architecture.',
  },
  {
    heading: { line1: 'Transforming Ideas', line2: 'Into Reality' },
    description: 'Code compilation successful...\nTypeScript types validated.\nCrafting pixel-perfect UIs with attention to detail.',
  },
  {
    heading: { line1: 'Code. Design.', line2: 'Innovate.' },
    description: 'System architecture deployed...\nPerformance metrics optimal.\nPushing boundaries of web development innovation.',
  },
  {
    heading: { line1: 'Creating Seamless', line2: 'User Journeys' },
    description: 'Development environment ready...\nModern frameworks integrated.\nCreating seamless user journeys across platforms.',
  },
];

export const CODE_SNIPPETS = [
  'const developer = new Developer();',
  'function buildFuture() { return code; }',
  'npm install creativity',
  'git commit -m "Ship it"',
  'while(alive) { code(); }',
  'interface Developer { passion: number; }',
  'export default Portfolio;',
  'async function innovate() {}',
] as const;

// Tech stack constants
export const TECH_COLORS: Record<string, { text: string; border: string; shadow: string }> = {
  React: { text: '#25e2f4', border: '#25e2f4', shadow: 'rgba(37,226,244,0.4)' },
  TypeScript: { text: '#60a5fa', border: '#60a5fa', shadow: 'rgba(96,165,250,0.4)' },
  JavaScript: { text: '#fbbf24', border: '#fbbf24', shadow: 'rgba(251,191,36,0.4)' },
  'Node.js': { text: '#34d399', border: '#34d399', shadow: 'rgba(52,211,153,0.4)' },
  Tailwind: { text: '#a855f7', border: '#a855f7', shadow: 'rgba(168,85,247,0.4)' },
  AWS: { text: '#fb923c', border: '#fb923c', shadow: 'rgba(251,146,60,0.4)' },
  'Three.js': { text: '#f472b6', border: '#f472b6', shadow: 'rgba(244,114,182,0.4)' },
} as const;

export const TECH_ICONS: Record<string, string> = {
  React: 'code_blocks',
  TypeScript: 'javascript',
  JavaScript: 'javascript',
  'Node.js': 'dataset',
  Tailwind: 'brush',
  AWS: 'cloud',
  'Three.js': 'view_in_ar',
} as const;

// Project constants
export const PROJECT_STATUS = {
  LIVE: { label: 'Live', color: '#34d399', pulse: true },
  BETA: { label: 'Beta', color: '#fbbf24', pulse: false },
} as const;

export const VERSIONS = ['1.2.0', '0.9.1', '3.0.0', '2.1.4', '1.0.0'] as const;

// Display limits
export const DISPLAY_LIMITS = {
  TECH_STACK: 8,
  INITIAL_PROJECTS: 3,
  FEATURED_PROJECTS: 3,
} as const;

// Repo names to always include and show first (e.g. from same or other GitHub user)
export const FEATURED_REPO_NAMES = ['ProjectFlow', 'CareerKit'] as const;

// One-line project descriptions (overrides repo description when set; add more as you add repos)
export const PROJECT_DESCRIPTIONS: Record<string, string> = {
  ProjectFlow: 'Task and project management app with real-time updates.',
  CareerKit: 'Career-focused portfolio builder with guided templates and project curation.',
};

// Repo names to never show in the portfolio UI (case-insensitive match in filtering)
export const EXCLUDED_REPO_NAMES = ['exclusive', 'furniro'] as const;

