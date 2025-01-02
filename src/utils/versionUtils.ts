import type { DocumentVersion, VersionDiff } from '../types/version';

export function compareVersions(oldVersion: DocumentVersion, newVersion: DocumentVersion): VersionDiff {
  // This is a simplified comparison - actual implementation would depend on document type
  return {
    added: [],
    removed: [],
    modified: []
  };
}

export function formatVersionNumber(version: number): string {
  return `v${version.toString().padStart(2, '0')}`;
}

export function getVersionSize(size: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = size;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
}