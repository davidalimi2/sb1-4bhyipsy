import { forwardRef } from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(({
  checked,
  onChange,
  disabled = false,
  label,
  className = ''
}, ref) => {
  return (
    <div className="flex items-center">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        ref={ref}
        className={`
          relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full
          ${checked ? 'bg-indigo-600' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2
          focus:ring-offset-2 focus:ring-indigo-500
          ${className}
        `}
      >
        <span className="sr-only">{label}</span>
        <span
          className={`
            pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow
            transform ring-0 transition ease-in-out duration-200
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
      {label && (
        <span className="ml-3 text-sm text-gray-900">{label}</span>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';