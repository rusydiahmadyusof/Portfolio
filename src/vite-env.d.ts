/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GITHUB_USERNAME: string;
  readonly VITE_GITHUB_TOKEN?: string;
  readonly VITE_REPO_TOPICS?: string;
  readonly VITE_REPO_URLS?: string;
  readonly VITE_AUTO_DETECT_DEPLOYMENT?: string;
  readonly VITE_SPECIAL_TECH_REPO?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

