import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { DocumentVersion } from '../../types/document';

interface Change {
  id: string;
  content: string;
  lineNumber: number;
}

interface Comparison {
  additions: Change[];
  deletions: Change[];
  modifications: Change[];
}

export function useComparison(sourceVersion: DocumentVersion, targetVersion: DocumentVersion) {
  const [comparison, setComparison] = useState<Comparison | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function compareVersions() {
      try {
        setIsLoading(true);

        // Download both version files
        const [sourceData, targetData] = await Promise.all([
          supabase.storage.from('documents').download(sourceVersion.storage_path),
          supabase.storage.from('documents').download(targetVersion.storage_path)
        ]);

        if (!sourceData.data || !targetData.data) {
          throw new Error('Failed to download version files');
        }

        // Convert blobs to text
        const [sourceText, targetText] = await Promise.all([
          sourceData.data.text(),
          targetData.data.text()
        ]);

        // Split into lines
        const sourceLines = sourceText.split('\n');
        const targetLines = targetText.split('\n');

        // Simple diff algorithm (this is a basic implementation)
        const additions: Change[] = [];
        const deletions: Change[] = [];
        const modifications: Change[] = [];

        let i = 0, j = 0;
        while (i < sourceLines.length || j < targetLines.length) {
          if (i >= sourceLines.length) {
            // Remaining lines in target are additions
            additions.push({
              id: `add-${j}`,
              content: targetLines[j],
              lineNumber: j + 1
            });
            j++;
          } else if (j >= targetLines.length) {
            // Remaining lines in source are deletions
            deletions.push({
              id: `del-${i}`,
              content: sourceLines[i],
              lineNumber: i + 1
            });
            i++;
          } else if (sourceLines[i] !== targetLines[j]) {
            // Lines differ - could be modification
            if (sourceLines[i + 1] === targetLines[j]) {
              // Deletion
              deletions.push({
                id: `del-${i}`,
                content: sourceLines[i],
                lineNumber: i + 1
              });
              i++;
            } else if (sourceLines[i] === targetLines[j + 1]) {
              // Addition
              additions.push({
                id: `add-${j}`,
                content: targetLines[j],
                lineNumber: j + 1
              });
              j++;
            } else {
              // Modification
              modifications.push({
                id: `mod-${i}`,
                content: `${sourceLines[i]} → ${targetLines[j]}`,
                lineNumber: i + 1
              });
              i++;
              j++;
            }
          } else {
            // Lines match
            i++;
            j++;
          }
        }

        setComparison({ additions, deletions, modifications });
      } catch (error) {
        console.error('Error comparing versions:', error);
        setComparison(null);
      } finally {
        setIsLoading(false);
      }
    }

    compareVersions();
  }, [sourceVersion.id, targetVersion.id]);

  return { comparison, isLoading };
}