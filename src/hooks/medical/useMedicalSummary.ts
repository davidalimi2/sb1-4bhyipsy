import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import { generateStoragePath } from '../../utils/storageUtils';
import type { MedicalSummary } from '../../types/medical';

export function useMedicalSummary(caseId: string) {
  const [summary, setSummary] = useState<MedicalSummary | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addNotification } = useNotifications();

  const analyzeMedicalRecords = async (files: File[]) => {
    try {
      setIsAnalyzing(true);

      // Upload files for analysis
      const uploads = files.map(async file => {
        const path = generateStoragePath('medical_records', file.name);
        const { error } = await supabase.storage
          .from('medical_records')
          .upload(path, file);

        if (error) throw error;
        return path;
      });

      await Promise.all(uploads);

      // Get analysis from Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-medical-records', {
        body: { caseId }
      });

      if (error) throw error;

      setSummary(data);
      return data;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Analysis failed',
        message: error instanceof Error ? error.message : 'Failed to analyze medical records'
      });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateReport = async () => {
    try {
      setIsAnalyzing(true);

      const { data, error } = await supabase.functions.invoke('generate-medical-report', {
        body: { summaryId: summary?.id }
      });

      if (error) throw error;

      addNotification({
        type: 'success',
        title: 'Report generated',
        message: 'Medical report has been generated successfully'
      });

      return data.documentId;
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Generation failed',
        message: error instanceof Error ? error.message : 'Failed to generate report'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    summary,
    isAnalyzing,
    analyzeMedicalRecords,
    generateReport
  };
}