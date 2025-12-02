export interface GitHubUser {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string | null;
  blog: string | null;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  readmeDescription?: string | null; // Description extracted from README
  readmeImage?: string | null; // Image URL extracted from README
  readmeTechStack?: string[]; // Tech stack extracted from README (frontend, backend, framework only)
  html_url: string;
  homepage: string | null;
  language: string | null;
  languages_url: string;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  updated_at: string;
  created_at: string;
  fork: boolean;
  archived: boolean;
  private: boolean;
}

export interface RepoLanguages {
  [language: string]: number;
}

export interface TechStackItem {
  name: string;
  percentage: number;
  bytes: number;
}

