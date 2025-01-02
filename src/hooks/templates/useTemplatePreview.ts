import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNotifications } from '../useNotifications';
import type { Template } from '../../types/template';

export function useTemplatePreview(template: Template) {
  const [previewContent, setPreviewContent] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const exportTemplate = async () => {
    try {
      const exportData = JSON.stringify(template, null, 2);
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.title.toLowerCase().replace(/\s+/g, '-')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addNotification({
        type: 'success',
        title: 'Template exported',
        message: 'Template has been exported successfully'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Export failed',
        message: error instanceof Error ? error.message : 'Failed to export template'
      });
    }
  };

  const shareTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from('shared_templates')
        .insert({
          template_id: template.id,
          shared_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      const shareUrl = `${window.location.origin}/templates/shared/${data.id}`;
      await navigator.clipboard.writeText(shareUrl);

      addNotification({
        type: 'success',
        title: 'Template shared',
        message: 'Share link has been copied to clipboard'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Share failed',
        message: error instanceof Error ? error.message : 'Failed to share template'
      });
    }
  };

  return {
    previewContent: template.structure?.elements || [],
    isLoading,
    exportTemplate,
    shareTemplate
  };
}