type ToggleOption<T extends string> = {
  label: string;
  value: T;
};

type SegmentedToggleProps<T extends string> = {
  ariaLabel: string;
  className?: string;
  onChange: (value: T) => void;
  options: [ToggleOption<T>, ToggleOption<T>];
  value: T;
};

export function SegmentedToggle<T extends string>({ ariaLabel, className = '', onChange, options, value }: SegmentedToggleProps<T>) {
  const activeIndex = options.findIndex((option) => option.value === value);
  const thumbIndex = activeIndex === 1 ? 1 : 0;

  return (
    <div
      aria-label={ariaLabel}
      className={className ? `segmented-toggle ${className}` : 'segmented-toggle'}
      role="group"
      style={{ '--toggle-index': thumbIndex } as CSSProperties & Record<'--toggle-index', number>}
    >
      {options.map((option) => (
        <button
          className={option.value === value ? 'active' : ''}
          key={option.value}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
import type { CSSProperties } from 'react';
