import { useMessageRules } from '../../../hooks/messages/useMessageRules';
import { RuleItem } from './RuleItem';
import { EmptyState } from '../../shared/EmptyState';
import { LoadingSpinner } from '../../shared/ui/LoadingSpinner';

export function RuleList() {
  const { rules, isLoading } = useMessageRules();

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
        title="No rules yet"
        description="Create rules to automatically organize your messages"
        action={{
          label: "Create Rule",
          href: "/settings/rules/new"
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      {rules.map((rule) => (
        <RuleItem key={rule.id} rule={rule} />
      ))}
    </div>
  );
}