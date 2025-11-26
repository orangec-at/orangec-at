import * as React from 'react';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from '@/lib/utils';

const inputVariants = cva(
  `
  flex w-full border bg-background transition-all
  placeholder:text-(--krds-gray-40)
  focus:outline-none focus:ring-2 focus:ring-(--bg-ds-default) focus:border-transparent
  disabled:cursor-not-allowed disabled:opacity-50
  overflow-hidden text-ellipsis whitespace-nowrap
  `,
  {
    variants: {
      size: {
        small: 'h-(--size-height-6) px-(--padding-6) text-sm h-(--size-height-6)  rounded-[6px]',
        medium: 'h-(--size-height-8) px-4 py-2.5 text-base  rounded-[6px]',
        large: 'h-(--size-height-10) px-6 py-3 text-lg rounded-[8px]',
      },
      state: {
        default: 'border-(--border-gray)',
        focused: 'border-(--bg-ds-default) border-2',
        completed: 'border-green-500 bg-green-50',
        error: 'border-(--krds-danger-50) border-2',
        disabled: 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50',
        view: 'border-transparent bg-gray-50 cursor-default',
      },
    },
    defaultVariants: {
      size: 'medium',
      state: 'default',
    },
  },
);

const inputWrapperVariants = cva('relative flex items-center', {
  variants: {
    size: {
      small: 'h-(--size-height-6)',
      medium: 'h-(--size-height-8)',
      large: 'h-(--size-height-10)',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});
type State = 'default' | 'focused' | 'completed' | 'error' | 'disabled' | 'view';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  state?: State;
  icon?: React.ReactNode;
  onSubmit?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({className, type, size, state, disabled, readOnly, icon, onSubmit, ...props}, ref) => {
    const [internalState, setInternalState] = React.useState<State>(state || 'default');

    React.useEffect(() => {
      if (disabled) {
        setInternalState('disabled');
      } else if (readOnly) {
        setInternalState('view');
      } else if (state) {
        setInternalState(state);
      }
    }, [disabled, readOnly, state]);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!state && !disabled && !readOnly) {
        setInternalState('default');
      }
      props.onBlur?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSubmit) {
        e.preventDefault();
        onSubmit();
      }
      props.onKeyDown?.(e);
    };

    const handleIconClick = () => {
      if (onSubmit && !disabled && !readOnly) {
        onSubmit();
      }
    };

    if (icon) {
      return (
        <div className={cn(inputWrapperVariants({size}))}>
          <input
            type={type}
            className={cn(inputVariants({size, state: internalState}), className, 'pr-14')}
            disabled={disabled}
            readOnly={readOnly}
            ref={ref}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            {...props}
          />
          <button
            type="button"
            className="absolute right-3 flex items-center justify-center rounded-sm bg-white"
            onClick={handleIconClick}
            disabled={disabled || readOnly}
            aria-label="검색">
            {icon}
          </button>
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(inputVariants({size, state: internalState, className}))}
        disabled={disabled}
        readOnly={readOnly}
        ref={ref}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export {Input, inputVariants};
