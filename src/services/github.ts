import type { GitHubUser, GitHubRepo, RepoLanguages } from '../types/github';

const GITHUB_API = 'https://api.github.com';
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || '';

const getHeaders = (): Record<string, string> => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) headers.Authorization = `token ${token}`;
  return headers;
};

const fetchAPI = async (url: string): Promise<any> => {
  const response = await fetch(url, { headers: getHeaders() });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

export const fetchUserProfile = async (): Promise<GitHubUser> => {
  if (!GITHUB_USERNAME) throw new Error('GitHub username is not configured');
  return fetchAPI(`${GITHUB_API}/users/${GITHUB_USERNAME}`);
};

export const fetchRepositories = async (): Promise<GitHubRepo[]> => {
  if (!GITHUB_USERNAME) throw new Error('GitHub username is not configured');
  return fetchAPI(
    `${GITHUB_API}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100&type=all`
  );
};

export const fetchRepoLanguages = async (
  repoName: string
): Promise<RepoLanguages> => {
  if (!GITHUB_USERNAME) return {};
  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repoName}/languages`,
      { headers: getHeaders() }
    );
    return response.ok ? await response.json() : {};
  } catch {
    return {};
  }
};

export const fetchRepoReadme = async (repoName: string): Promise<string> => {
  if (!GITHUB_USERNAME) return '';
  try {
    const response = await fetch(
      `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repoName}/readme`,
      { headers: { ...getHeaders(), Accept: 'application/vnd.github.v3.raw' } }
    );
    if (response.ok) return await response.text();

    // Fallback: try JSON format
    const json = await fetchAPI(
      `${GITHUB_API}/repos/${GITHUB_USERNAME}/${repoName}/readme`
    );
    return json.content ? atob(json.content.replace(/\n/g, '')) : '';
  } catch {
    return '';
  }
};

const extractDescriptionFromReadme = (content: string): string | null => {
  if (!content) return null;

  // Remove title (first line with #)
  const lines = content.split('\n').filter((line) => line.trim());
  let startIndex = 0;

  // Skip title and empty lines
  while (
    startIndex < lines.length &&
    (lines[startIndex].startsWith('#') || !lines[startIndex].trim())
  ) {
    startIndex++;
  }

  // Get first meaningful paragraph (usually 1-3 lines after title)
  const descriptionLines: string[] = [];
  for (let i = startIndex; i < Math.min(startIndex + 5, lines.length); i++) {
    const line = lines[i].trim();
    // Skip markdown syntax, badges, and empty lines
    if (
      line &&
      !line.startsWith('#') &&
      !line.startsWith('![') &&
      !line.startsWith('[') &&
      !line.startsWith('```') &&
      !line.startsWith('---') &&
      !line.startsWith('|')
    ) {
      // Remove markdown links and formatting
      const cleanLine = line
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold
        .replace(/\*([^*]+)\*/g, '$1') // Remove italic
        .replace(/`([^`]+)`/g, '$1') // Remove code
        .trim();

      if (cleanLine.length > 10) {
        descriptionLines.push(cleanLine);
        // Stop if we have a good description (2-3 sentences or 150+ chars)
        if (
          descriptionLines.join(' ').length > 150 ||
          descriptionLines.length >= 2
        )
          break;
      }
    }
  }

  let description = descriptionLines.join(' ').trim();

  // Truncate if too long (max 120 characters)
  if (description.length > 120) {
    description = description.substring(0, 120).trim();
    // Try to cut at a sentence end or word boundary
    const lastPeriod = description.lastIndexOf('.');
    const lastSpace = description.lastIndexOf(' ');
    if (lastPeriod > 80) {
      description = description.substring(0, lastPeriod + 1);
    } else if (lastSpace > 80) {
      description = description.substring(0, lastSpace) + '...';
    } else {
      description = description + '...';
    }
  }

  return description.length > 20 ? description : null;
};

const extractImageFromReadme = (
  content: string,
  repoName: string
): string | null => {
  if (!content || !GITHUB_USERNAME) return null;

  // Find first image in README (usually at the top, before description)
  // Pattern: ![alt](url) or ![alt](./path/to/image.png)
  const imagePattern = /!\[([^\]]*)\]\(([^\)]+)\)/g;
  const images: Array<{ url: string; index: number }> = [];

  let match;
  while ((match = imagePattern.exec(content)) !== null) {
    let imageUrl = match[2]?.trim();
    if (!imageUrl) continue;

    // Skip badges, shields, and small icons
    const skipPatterns = [
      'badge',
      'shields.io',
      'img.shields.io',
      'github.com',
      'githubusercontent.com',
    ];
    if (
      skipPatterns.some(
        (pattern) => imageUrl.includes(pattern) && imageUrl.includes('badge')
      )
    ) {
      continue;
    }

    // Skip very small images (likely icons)
    if (imageUrl.includes('icon') && imageUrl.length < 50) continue;

    // Handle relative paths - convert to GitHub raw URL
    if (
      imageUrl.startsWith('./') ||
      imageUrl.startsWith('../') ||
      (!imageUrl.startsWith('http') &&
        !imageUrl.startsWith('//') &&
        !imageUrl.startsWith('data:'))
    ) {
      const branch = 'main'; // Default branch
      const cleanPath = imageUrl.replace(/^\.\//, '').replace(/^\.\.\//, '');
      imageUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repoName}/${branch}/${cleanPath}`;
    }

    // Validate it's a valid image URL
    const isValidImage =
      imageUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i) ||
      imageUrl.includes('raw.githubusercontent.com') ||
      imageUrl.includes('githubusercontent.com') ||
      imageUrl.startsWith('data:image');

    if (isValidImage) {
      images.push({ url: imageUrl, index: match.index });
    }
  }

  // Return first valid image (usually the project preview/screenshot)
  return images.length > 0 ? images[0].url : null;
};

export const fetchRepoDescription = async (
  repoName: string
): Promise<{
  description: string | null;
  image: string | null;
  techStack: string[];
}> => {
  try {
    const readme = await fetchRepoReadme(repoName);
    return {
      description: extractDescriptionFromReadme(readme),
      image: extractImageFromReadme(readme, repoName),
      techStack: parseCategorizedTechStackFromReadme(readme),
    };
  } catch {
    return { description: null, image: null, techStack: [] };
  }
};

const parseTechStackFromReadme = (content: string): string[] => {
  if (!content) return [];

  // Find Tech Stack section
  const sectionMatch = content.match(
    /###\s*[🛠️]*\s*Tech\s*Stack[\s\S]*?(?=###|##|$)/i
  );
  if (!sectionMatch) return [];

  const section = sectionMatch[0];
  const techStack: string[] = [];
  const skipWords = [
    'and',
    'or',
    'with',
    'using',
    'via',
    'from',
    'to',
    'the',
    'a',
    'an',
    'for',
    'by',
  ];

  // Extract from pattern: * **Label:** value1, value2, value3
  const pattern = /\*\s+\*\*([^*:]+):\*\*\s*([^\n]+)/g;
  let match;

  while ((match = pattern.exec(section)) !== null) {
    const label = match[1].trim().toLowerCase();
    // Skip section headers
    if (
      label.includes('development') ||
      label.includes('database') ||
      label.includes('tools')
    )
      continue;

    const values = match[2].trim();
    const items = values
      .split(',')
      .map((item) =>
        item
          .trim()
          .replace(/\s*\([^)]*\)\s*/g, '')
          .replace(/\s+/g, ' ')
      )
      .filter(
        (item) =>
          item.length > 1 &&
          !skipWords.includes(item.toLowerCase()) &&
          !item.endsWith(':')
      );

    items.forEach((item) => {
      if (!techStack.includes(item)) techStack.push(item);
    });
  }

  // Remove duplicates (case-insensitive)
  return techStack.filter(
    (tech, index, self) =>
      self.findIndex((t) => t.toLowerCase() === tech.toLowerCase()) === index
  );
};

const parseCategorizedTechStackFromReadme = (content: string): string[] => {
  if (!content) return [];

  // Find Tech Stack section - more flexible matching (handles various formats)
  let sectionMatch = content.match(
    /(?:###|##)\s*[🛠️]*\s*Tech\s*Stack[\s\S]*?(?=(?:###|##|$))/i
  );

  // If no explicit Tech Stack section, try to find any section mentioning tech/stack
  if (!sectionMatch) {
    sectionMatch = content.match(
      /(?:###|##)\s*[🛠️]*\s*(?:Technologies|Stack|Tech|Built\s+With)[\s\S]*?(?=(?:###|##|$))/i
    );
    if (!sectionMatch) return [];
  }

  const section = sectionMatch[0];
  const techStack: string[] = [];
  const allowedCategories = [
    'frontend',
    'backend',
    'framework',
    'front-end',
    'back-end',
  ];

  // Multiple patterns to handle different markdown formats:
  // Pattern 1: * **Label:** value1, value2, value3
  // Pattern 2: * **Label** value1, value2, value3
  // Pattern 3: - **Label:** value1, value2, value3
  // Pattern 4: - Label: value1, value2, value3
  // Pattern 5: * Label: value1, value2, value3
  // Pattern 6: **Label:** value1, value2, value3 (without bullet)
  const patterns = [
    /\*\s+\*\*([^*:]+):\*\*\s*([^\n]+)/g,
    /\*\s+\*\*([^*]+)\*\*\s*([^\n]+)/g,
    /-\s+\*\*([^*:]+):\*\*\s*([^\n]+)/g,
    /-\s+([^:]+):\s*([^\n]+)/g,
    /\*\s+([^:]+):\s*([^\n]+)/g,
    /\*\*([^*:]+):\*\*\s*([^\n]+)/g,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(section)) !== null) {
      const label = match[1].trim().toLowerCase().replace(/\s+/g, '-');
      const values = match[2]?.trim() || '';

      // Only extract from frontend, backend, or framework categories
      const isAllowedCategory = allowedCategories.some((cat) => {
        const normalizedLabel = label.replace(/[^a-z0-9]/g, '');
        const normalizedCat = cat.replace(/[^a-z0-9]/g, '');
        return (
          normalizedLabel.includes(normalizedCat) ||
          normalizedLabel === normalizedCat
        );
      });

      if (!isAllowedCategory) continue;

      // Extract tech names from values - handle multiple separators
      const items = values
        .split(/[,|•\n]/) // Split by comma, pipe, bullet, or newline
        .map(
          (item) =>
            item
              .trim()
              .replace(/\s*\([^)]*\)\s*/g, '') // Remove parentheses content
              .replace(/\s+/g, ' ')
              .replace(/^[-•*]\s*/, '') // Remove leading bullet points
              .replace(/\s*[-•*]\s*$/, '') // Remove trailing bullet points
        )
        .filter(
          (item) =>
            item.length > 1 &&
            !item.endsWith(':') &&
            !item.match(/^and\s/i) &&
            !item.match(/^or\s/i) &&
            !item.match(/^with\s/i)
        );

      items.forEach((item) => {
        const normalized = item.trim();
        if (normalized) {
          // Normalize common tech name variations
          let techName = normalized;

          // Normalize Next.js variations
          if (/next\.?js/i.test(techName)) {
            techName = 'Next.js';
          }
          // Normalize Tailwind CSS variations (must check before general CSS)
          else if (/tailwind/i.test(techName)) {
            techName = 'Tailwind CSS';
          }
          // Normalize Firebase
          else if (/firebase/i.test(techName)) {
            techName = 'Firebase';
          }
          // Normalize React
          else if (/^react$/i.test(techName)) {
            techName = 'React';
          }
          // Normalize TypeScript
          else if (/typescript|ts$/i.test(techName)) {
            techName = 'TypeScript';
          }
          // Normalize JavaScript
          else if (
            /javascript|js$/i.test(techName) &&
            !techName.toLowerCase().includes('next')
          ) {
            techName = 'JavaScript';
          }
          // Capitalize first letter of each word for other techs
          else {
            techName = techName
              .split(/\s+/)
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(' ');
          }

          // Check if already exists (case-insensitive)
          const exists = techStack.some(
            (t) => t.toLowerCase() === techName.toLowerCase()
          );
          if (!exists && techName.length > 0) {
            techStack.push(techName);
          }
        }
      });
    }
  }

  // Fallback: If we found some tech but missing common ones, search the entire section
  // This handles cases where tech might be listed differently
  if (techStack.length > 0 && techStack.length < 3) {
    const commonTechs = [
      { patterns: [/next\.?js/i, /nextjs/i], name: 'Next.js' },
      { patterns: [/tailwind/i, /tailwindcss/i], name: 'Tailwind CSS' },
      { patterns: [/firebase/i], name: 'Firebase' },
      { patterns: [/react/i], name: 'React' },
      { patterns: [/typescript/i, /ts\b/i], name: 'TypeScript' },
      { patterns: [/javascript/i, /js\b/i], name: 'JavaScript' },
    ];

    commonTechs.forEach(({ patterns, name }) => {
      const exists = techStack.some(
        (t) => t.toLowerCase() === name.toLowerCase()
      );
      if (!exists) {
        const found = patterns.some((pattern) => pattern.test(section));
        if (found) {
          techStack.push(name);
        }
      }
    });
  }

  // Remove duplicates (case-insensitive)
  return techStack.filter(
    (tech, index, self) =>
      self.findIndex((t) => t.toLowerCase() === tech.toLowerCase()) === index
  );
};

const fetchSpecialRepoTechStack = async (
  repoName: string
): Promise<string[]> => {
  try {
    const content = await fetchRepoReadme(repoName);
    return parseTechStackFromReadme(content);
  } catch {
    return [];
  }
};

export const fetchAllRepoLanguages = async (
  repos: GitHubRepo[]
): Promise<Map<string, RepoLanguages>> => {
  const languageMap = new Map<string, RepoLanguages>();
  const specialRepoName =
    import.meta.env.VITE_SPECIAL_TECH_REPO || 'rusydiahmadyusof';
  const activeRepos = repos ? repos.filter((r) => !r.fork && !r.archived) : [];

  // Fetch README tech stack
  const readmeTechStack = await fetchSpecialRepoTechStack(specialRepoName);
  if (readmeTechStack.length > 0) {
    const readmeMap: RepoLanguages = {};
    readmeTechStack.forEach((tech, index) => {
      readmeMap[tech] = 50000 - index * 1000;
    });
    languageMap.set(`__readme__${specialRepoName}`, readmeMap);
  }

  // Fetch languages from repos
  const batchSize = 5;
  for (let i = 0; i < activeRepos.length; i += batchSize) {
    const batch = activeRepos.slice(i, i + batchSize);
    const results = await Promise.all(
      batch.map((repo) =>
        fetchRepoLanguages(repo.name).then((langs) => ({
          name: repo.name,
          langs,
        }))
      )
    );
    results.forEach(({ name, langs }) => languageMap.set(name, langs));
    if (i + batchSize < activeRepos.length)
      await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return languageMap;
};
