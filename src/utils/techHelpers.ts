import { TECH_COLORS, TECH_ICONS } from './constants';

export const getTechColor = (techName: string): { text: string; border: string; shadow: string } => {
  for (const [key, value] of Object.entries(TECH_COLORS)) {
    if (techName.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  return { text: '#25e2f4', border: '#25e2f4', shadow: 'rgba(37,226,244,0.4)' };
};

export const getTechIconName = (techName: string): string => {
  for (const [key, value] of Object.entries(TECH_ICONS)) {
    if (techName.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  return 'code';
};

