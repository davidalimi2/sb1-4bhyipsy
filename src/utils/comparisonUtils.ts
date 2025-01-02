import type { Change, ComparisonResult } from '../types/comparison';

export function highlightChanges(content: string, changes: Change[]): string {
  // This is a simplified implementation
  // A real implementation would need to handle overlapping changes
  let result = content;
  
  // Sort changes by line number in descending order to avoid offset issues
  const sortedChanges = [...changes].sort((a, b) => b.lineNumber - a.lineNumber);
  
  for (const change of sortedChanges) {
    const lines = result.split('\n');
    lines[change.lineNumber - 1] = highlightLine(lines[change.lineNumber - 1], change.type);
    result = lines.join('\n');
  }
  
  return result;
}

function highlightLine(line: string, type: Change['type']): string {
  const colors = {
    addition: 'bg-green-100',
    deletion: 'bg-red-100',
    modification: 'bg-yellow-100'
  };
  
  return `<span class="${colors[type]}">${line}</span>`;
}

export function getChangesSummary(result: ComparisonResult): string {
  const { additions, deletions, modifications } = result.changes;
  const total = additions.length + deletions.length + modifications.length;
  
  if (total === 0) {
    return 'No changes detected';
  }
  
  const parts = [];
  if (additions.length) parts.push(`${additions.length} addition${additions.length === 1 ? '' : 's'}`);
  if (deletions.length) parts.push(`${deletions.length} deletion${deletions.length === 1 ? '' : 's'}`);
  if (modifications.length) parts.push(`${modifications.length} modification${modifications.length === 1 ? '' : 's'}`);
  
  return parts.join(', ');
}