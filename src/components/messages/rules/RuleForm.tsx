import { useState } from 'react';
import { Plus, Trash } from 'lucide-react';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { Button } from '../../shared/ui/Button';
import type { Rule, RuleCondition, RuleAction } from '../../../types/message';

interface RuleFormProps {
  initialData?: Partial<Rule>;
  onSubmit: (data: Omit<Rule, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  isSubmitting?: boolean;
}

export function RuleForm({ initialData, onSubmit, isSubmitting }: RuleFormProps) {
  const [formData, setFormData] = useState<Partial<Rule>>({
    name: '',
    active: true,
    conditions: [],
    actions: [],
    ...initialData
  });

  const addCondition = () => {
    setFormData(prev => ({
      ...prev,
      conditions: [
        ...(prev.conditions || []),
        { field: 'subject', operator: 'contains', value: '' }
      ]
    }));
  };

  const addAction = () => {
    setFormData(prev => ({
      ...prev,
      actions: [
        ...(prev.actions || []),
        { type: 'move_to', value: '' }
      ]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.conditions?.length || !formData.actions?.length) return;
    await onSubmit(formData as Omit<Rule, 'id' | 'created_at' | 'updated_at'>);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Rule Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <div>
        <h3 className="text-sm font-medium mb-2">Conditions</h3>
        <div className="space-y-2">
          {formData.conditions?.map((condition, index) => (
            <div key={index} className="flex gap-2">
              <Select
                value={condition.field}
                onChange={(e) => {
                  const newConditions = [...(formData.conditions || [])];
                  newConditions[index] = {
                    ...condition,
                    field: e.target.value as RuleCondition['field']
                  };
                  setFormData({ ...formData, conditions: newConditions });
                }}
              >
                <option value="subject">Subject</option>
                <option value="sender_id">Sender</option>
                <option value="content">Content</option>
              </Select>

              <Select
                value={condition.operator}
                onChange={(e) => {
                  const newConditions = [...(formData.conditions || [])];
                  newConditions[index] = {
                    ...condition,
                    operator: e.target.value as RuleCondition['operator']
                  };
                  setFormData({ ...formData, conditions: newConditions });
                }}
              >
                <option value="contains">Contains</option>
                <option value="equals">Equals</option>
                <option value="starts_with">Starts with</option>
                <option value="ends_with">Ends with</option>
              </Select>

              <Input
                value={condition.value}
                onChange={(e) => {
                  const newConditions = [...(formData.conditions || [])];
                  newConditions[index] = {
                    ...condition,
                    value: e.target.value
                  };
                  setFormData({ ...formData, conditions: newConditions });
                }}
                placeholder="Value"
              />

              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const newConditions = [...(formData.conditions || [])];
                  newConditions.splice(index, 1);
                  setFormData({ ...formData, conditions: newConditions });
                }}
                icon={<Trash className="h-4 w-4" />}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={addCondition}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Condition
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Actions</h3>
        <div className="space-y-2">
          {formData.actions?.map((action, index) => (
            <div key={index} className="flex gap-2">
              <Select
                value={action.type}
                onChange={(e) => {
                  const newActions = [...(formData.actions || [])];
                  newActions[index] = {
                    ...action,
                    type: e.target.value as RuleAction['type']
                  };
                  setFormData({ ...formData, actions: newActions });
                }}
              >
                <option value="move_to">Move to folder</option>
                <option value="label">Add label</option>
                <option value="mark_as">Mark as</option>
                <option value="forward_to">Forward to</option>
              </Select>

              <Input
                value={action.value}
                onChange={(e) => {
                  const newActions = [...(formData.actions || [])];
                  newActions[index] = {
                    ...action,
                    value: e.target.value
                  };
                  setFormData({ ...formData, actions: newActions });
                }}
                placeholder="Value"
              />

              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const newActions = [...(formData.actions || [])];
                  newActions.splice(index, 1);
                  setFormData({ ...formData, actions: newActions });
                }}
                icon={<Trash className="h-4 w-4" />}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={addAction}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Action
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!formData.name || !formData.conditions?.length || !formData.actions?.length}
        >
          Save Rule
        </Button>
      </div>
    </form>
  );
}