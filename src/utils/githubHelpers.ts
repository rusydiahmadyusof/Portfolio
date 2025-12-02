import type { GitHubRepo, RepoLanguages, TechStackItem } from '../types/github';

const getAllowedTopics = (): string[] | null => {
  const topics = import.meta.env.VITE_REPO_TOPICS;
  return topics ? topics.split(',').map(t => t.trim().toLowerCase()).filter(t => t) : null;
};

const hasAllowedTopic = (repo: GitHubRepo, topics: string[]): boolean => {
  if (!repo.topics?.length) return false;
  const repoTopics = repo.topics.map(t => t.toLowerCase());
  return topics.some(t => repoTopics.includes(t));
};

const getTopicPriority = (repo: GitHubRepo): number => {
  if (!repo.topics?.length) return 999;
  const topics = repo.topics.map(t => t.toLowerCase());
  if (topics.includes('ongoing')) return 1;
  if (topics.includes('featured')) return 2;
  if (topics.includes('case-study')) return 3;
  return 999;
};

export const filterRepositories = (repos: GitHubRepo[]): GitHubRepo[] => {
  const allowedTopics = getAllowedTopics();
  
  const filtered = repos.filter(repo => {
    if (repo.fork || repo.archived || repo.private) return false;
    if (allowedTopics) return hasAllowedTopic(repo, allowedTopics);
    return true;
  });
  
  return filtered.sort((a, b) => {
    const priorityDiff = getTopicPriority(a) - getTopicPriority(b);
    return priorityDiff !== 0 ? priorityDiff : new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
};

export const calculateTechStack = (
  repos: GitHubRepo[],
  languagesMap: Map<string, RepoLanguages>
): TechStackItem[] => {
  const totalBytes: { [key: string]: number } = {};
  const specialRepoName = import.meta.env.VITE_SPECIAL_TECH_REPO || 'rusydiahmadyusof';
  
  // Add languages from repos
  repos.forEach(repo => {
    const langs = languagesMap.get(repo.name);
    if (langs) {
      Object.entries(langs).forEach(([lang, bytes]) => {
        totalBytes[lang] = (totalBytes[lang] || 0) + bytes;
      });
    }
    
    // Add tech stack from each project's README (high priority)
    if (repo.readmeTechStack && repo.readmeTechStack.length > 0) {
      repo.readmeTechStack.forEach((tech, index) => {
        // Give high weight to tech from READMEs
        const weight = 10000 - index * 100;
        totalBytes[tech] = (totalBytes[tech] || 0) + weight;
      });
    }
  });
  
  // Add README tech stack from special repo (highest priority)
  const readmeStack = languagesMap.get(`__readme__${specialRepoName}`);
  if (readmeStack) {
    Object.entries(readmeStack).forEach(([tech, weight]) => {
      totalBytes[tech] = (totalBytes[tech] || 0) + weight;
    });
  }
  
  const total = Object.values(totalBytes).reduce((sum, bytes) => sum + bytes, 0);
  
  return Object.entries(totalBytes)
    .map(([name, bytes]) => ({ name, bytes, percentage: total > 0 ? (bytes / total) * 100 : 0 }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 12); // Limit to top 12 most popular
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

import { sanitizeUrl } from './security';

export const getDeploymentUrl = (repo: { name: string; homepage: string | null }): string | null => {
  // Sanitize homepage URL if present
  if (repo.homepage) {
    const sanitized = sanitizeUrl(repo.homepage);
    if (sanitized) return sanitized;
  }
  
  const customUrls = import.meta.env.VITE_REPO_URLS;
  if (customUrls) {
    const urlMap: { [key: string]: string } = {};
    customUrls.split(',').forEach(mapping => {
      const [name, url] = mapping.split(':');
      if (name && url) {
        const sanitized = sanitizeUrl(url.trim());
        if (sanitized) urlMap[name.trim()] = sanitized;
      }
    });
    if (urlMap[repo.name]) return urlMap[repo.name];
  }
  
  if (import.meta.env.VITE_AUTO_DETECT_DEPLOYMENT === 'false') return null;
  const username = import.meta.env.VITE_GITHUB_USERNAME || '';
  if (!username) return null;
  
  // Sanitize auto-detected URL
  const autoUrl = `https://${repo.name}.vercel.app`;
  return sanitizeUrl(autoUrl);
};

const iconMap: { [key: string]: string } = {
  JavaScript: 'javascript', TypeScript: 'typescript', Python: 'python', Java: 'java',
  'C++': 'cplusplus', C: 'c', 'C#': 'csharp', PHP: 'php', Ruby: 'ruby', Go: 'go',
  Rust: 'rust', Swift: 'swift', Kotlin: 'kotlin', Dart: 'dart', HTML: 'html5',
  CSS: 'css3', SCSS: 'sass', SASS: 'sass', React: 'react', Vue: 'vuedotjs',
  Angular: 'angular', Svelte: 'svelte', Next: 'nextdotjs', 'Next.js': 'nextdotjs',
  Node: 'nodedotjs', 'Node.js': 'nodedotjs', Express: 'express', Django: 'django',
  Flask: 'flask', Rails: 'rubyonrails', Laravel: 'laravel', Bootstrap: 'bootstrap',
  Tailwind: 'tailwindcss', 'Tailwind CSS': 'tailwindcss', MySQL: 'mysql',
  PostgreSQL: 'postgresql', MongoDB: 'mongodb', Redis: 'redis', Docker: 'docker',
  Kubernetes: 'kubernetes', AWS: 'amazonaws', Azure: 'microsoftazure', Git: 'git',
  GitHub: 'github', GitLab: 'gitlab', NPM: 'npm', Vite: 'vite', Firebase: 'firebase',
  Vercel: 'vercel', Netlify: 'netlify', Flutter: 'flutter',
};

const colorMap: { [key: string]: string } = {
  JavaScript: '#F7DF1E', TypeScript: '#3178C6', Python: '#3776AB', Java: '#ED8B00',
  'C++': '#00599C', C: '#A8B9CC', 'C#': '#239120', PHP: '#777BB4', Ruby: '#CC342D',
  Go: '#00ADD8', Rust: '#000000', Swift: '#FA7343', HTML: '#E34F26', CSS: '#1572B6',
  SCSS: '#CC6699', Vue: '#4FC08D', React: '#61DAFB', Angular: '#DD0031', 'Node.js': '#339933',
};

export const getTechIcon = (techName: string) => {
  const normalized = techName.toLowerCase().trim();
  const slug = iconMap[techName] || 
    Object.keys(iconMap).find(k => k.toLowerCase() === normalized) ||
    normalized.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return {
    slug,
    url: `https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/${slug}.svg`,
    color: colorMap[techName] || '#6B7280',
  };
};
