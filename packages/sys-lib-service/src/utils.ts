import { statSync } from 'fs';

export const isFile = (name: string): boolean => {
  try {
    const stats = statSync(name);
    return !stats.isDirectory();
  } catch (_error) {
    return false;
  }
};