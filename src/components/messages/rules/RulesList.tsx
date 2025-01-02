import { Plus } from 'lucide-react';
import { useRules } from '../../../hooks/messages/useRules';
import { RuleItem } from './RuleItem';
import { Button } from '../../shared/ui/Button';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';
import { EmptyState } from '../../shared/EmptyState';

export function RulesList() {
  const { rules, isLoading } = useRules();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!rules.length) {
    return (
      <EmptyState
        title="No message rules"
        description="Create rules to automatically organize your messages"
        action={{
          label: "Create Rule",
          href: "/settings/rules/new"
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Message Rules</h2>
        <Button
          href="/settings/rules/new"
          icon={<Plus className="h-4 w-4" />}
        >
          New Rule
        </Button>
      </div>

      <div className="space-y-4">
        {rules.map((rule) => (
          <RuleItem key={rule.id} rule={rule} />
        ))}
      </div>
    </div>
  );
}