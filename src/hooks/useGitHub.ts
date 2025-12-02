import useSWR from 'swr';
import { fetchUserProfile, fetchRepositories, fetchAllRepoLanguages, fetchRepoDescription } from '../services/github';
import { filterRepositories, calculateTechStack } from '../utils/githubHelpers';
import type { GitHubUser, GitHubRepo, TechStackItem } from '../types/github';

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || '';

interface UseGitHubReturn {
  user: GitHubUser | undefined;
  repos: GitHubRepo[];
  techStack: TechStackItem[];
  languagesMap: Map<string, RepoLanguages> | undefined;
  loading: boolean;
  error: Error | undefined;
  isConfigured: boolean;
}

export const useGitHub = (): UseGitHubReturn => {
  const isConfigured = Boolean(GITHUB_USERNAME);

  const { data: user, error: userError } = useSWR(
    isConfigured ? 'github-user' : null,
    fetchUserProfile,
    { revalidateOnFocus: false, revalidateOnReconnect: true, dedupingInterval: 3600000 }
  );

  const { data: repos, error: reposError } = useSWR(
    isConfigured ? 'github-repos' : null,
    fetchRepositories,
    { revalidateOnFocus: false, revalidateOnReconnect: true, dedupingInterval: 3600000 }
  );

  const filteredRepos = repos ? filterRepositories(repos) : [];

  const { data: languagesMap, error: languagesError, isLoading: languagesLoading } = useSWR(
    isConfigured ? ['github-languages', filteredRepos.map(r => r.name)] : null,
    () => fetchAllRepoLanguages(filteredRepos || []),
    { revalidateOnFocus: false, revalidateOnReconnect: true, dedupingInterval: 86400000 }
  );

  // Fetch README descriptions, images, and tech stack for repos
  const { data: repoData } = useSWR(
    filteredRepos.length > 0 ? ['repo-data', filteredRepos.map(r => r.name)] : null,
    async () => {
      const descriptions = new Map<string, string | null>();
      const images = new Map<string, string | null>();
      const techStacks = new Map<string, string[]>();
      const batchSize = 3; // Smaller batch for README fetching
      
      for (let i = 0; i < filteredRepos.length; i += batchSize) {
        const batch = filteredRepos.slice(i, i + batchSize);
        const results = await Promise.all(
          batch.map(repo => fetchRepoDescription(repo.name).then(data => ({ name: repo.name, ...data })))
        );
        results.forEach(({ name, description, image, techStack }) => {
          descriptions.set(name, description);
          images.set(name, image);
          techStacks.set(name, techStack);
        });
        if (i + batchSize < filteredRepos.length) await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      return { descriptions, images, techStacks };
    },
    { revalidateOnFocus: false, revalidateOnReconnect: true, dedupingInterval: 86400000 }
  );

  // Merge README data into repos
  const reposWithDescriptions = filteredRepos.map(repo => {
    const readmeTechStack = repoData?.techStacks.get(repo.name) || [];
    
    // Fallback: If no tech stack from README, use languages from languagesMap
    let techStack = readmeTechStack;
    if (techStack.length === 0 && languagesMap) {
      const repoLangs = languagesMap.get(repo.name);
      if (repoLangs) {
        // Get top 4 languages by bytes
        techStack = Object.entries(repoLangs)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 4)
          .map(([lang]) => lang);
      }
    }
    
    return {
      ...repo,
      readmeDescription: repoData?.descriptions.get(repo.name) || null,
      readmeImage: repoData?.images.get(repo.name) || null,
      readmeTechStack: techStack,
    };
  });

  let techStack: TechStackItem[] = [];
  if (repos && languagesMap && languagesMap.size > 0) {
    techStack = calculateTechStack(reposWithDescriptions, languagesMap);
  } else if (repos && filteredRepos.length > 0 && !languagesLoading) {
    // Fallback: use primary language from repos
    const primaryLangs: { [key: string]: number } = {};
    filteredRepos.forEach(repo => {
      if (repo.language) primaryLangs[repo.language] = (primaryLangs[repo.language] || 0) + 1;
    });
    const total = Object.values(primaryLangs).reduce((sum, count) => sum + count, 0);
    techStack = Object.entries(primaryLangs)
      .map(([name, count]) => ({ name, bytes: count, percentage: total > 0 ? (count / total) * 100 : 0 }))
      .sort((a, b) => b.bytes - a.bytes)
      .slice(0, 12);
  }

  return {
    user,
    repos: reposWithDescriptions,
    techStack,
    languagesMap,
    loading: isConfigured && (!user && !userError && !repos && !reposError) || languagesLoading,
    error: (userError || reposError || languagesError) as Error | undefined,
    isConfigured,
  };
};
