import { Switch } from '../../shared/ui/Switch';
import { Button } from '../../shared/ui/Button';
import { useRules } from '../../../hooks/messages/useRules';
import type { Rule } from '../../../types/message';

interface RuleItemProps {
  rule: Rule;
}

export function RuleItem({ rule }: RuleItemProps) {
  const { updateRule, deleteRule } = useRules();

  const handleToggle = async (active: boolean) => {
    await updateRule(rule.id, { active });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{rule.name}</h3>
          <p className="text-sm text-gray-500">
            {rule.active ? 'Active' : 'Inactive'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Switch
            checked={rule.active}
            onChange={handleToggle}
          />
          <Button
            variant="secondary"
            size="sm"
            href={`/settings/rules/${rule.id}/edit`}
          >
            Edit
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => deleteRule(rule.id)}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Conditions
          </h4>
          <ul className="space-y-1">
            {rule.conditions.map((condition, index) => (
              <li key={index} className="text-sm text-gray-600">
                {condition.field} {condition.operator} "{condition.value}"
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Actions
          </h4>
          <ul className="space-y-1">
            {rule.actions.map((action, index) => (
              <li key={index} className="text-sm text-gray-600">
                {action.type.replace('_', ' ')} "{action.value}"
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}