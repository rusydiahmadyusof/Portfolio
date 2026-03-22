import type { CSSProperties } from 'react';
import type { IconType } from 'react-icons';
import {
  SiCss3,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from 'react-icons/si';
import { getTechIconName } from '../utils/techHelpers';

const BRAND_ICONS: Record<string, IconType> = {
  typescript: SiTypescript,
  javascript: SiJavascript,
  react: SiReact,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
  tailwindcss: SiTailwindcss,
  supabase: SiSupabase,
  vite: SiVite,
  postgresql: SiPostgresql,
  css3: SiCss3,
};

function techNameToKey(name: string): string {
  const raw = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\./g, '');
  if (raw === 'plpgsql' || raw === 'postgresql' || raw === 'postgres') return 'postgresql';
  if (raw === 'css' || raw === 'css3') return 'css3';
  return raw;
}

type Props = {
  name: string;
  className?: string;
  style?: CSSProperties;
};

/** Simple Icons where we have a mapping; otherwise Material Symbol fallback. */
export function TechBrandIcon({ name, className, style }: Props) {
  const Icon = BRAND_ICONS[techNameToKey(name)];
  if (Icon) {
    return <Icon className={className} style={style} aria-hidden />;
  }
  return (
    <span className={`material-symbols-outlined text-3xl ${className ?? ''}`} style={style}>
      {getTechIconName(name)}
    </span>
  );
}
