import { Input } from '../../shared/ui/Input';

interface SubjectFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function SubjectField({ value, onChange, error }: SubjectFieldProps) {
  return (
    <Input
      label="Subject"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      error={error}
      required
    />
  );
}