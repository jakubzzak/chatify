'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { MessageType, useMessage } from '@/app/_providers/intl/message';

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'placeholder'
  > {
  timeout?: number;
  onChange: (value: any) => void;
  nativeOnChange?: boolean;
  placeholder?: MessageType;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      placeholder,
      nativeOnChange,
      value,
      timeout = 300,
      onChange,
      ...props
    },
    ref,
  ) => {
    let [_value, _onChange] = useState(value);
    const t = useMessage();

    useEffect(() => {
      if (!nativeOnChange) _onChange(value);
    }, [value]);

    useEffect(() => {
      if (value === _value) return;

      if (
        _value == undefined ||
        (typeof _value === 'string' && _value.length < 1)
      ) {
        onChange(_value);
        return;
      }

      const _timeout = setTimeout(() => onChange(_value), timeout);

      return () => clearTimeout(_timeout);
    }, [_value]);

    function handleOnChange(event) {
      if (nativeOnChange) onChange(event);
      else if (type === 'number')
        _onChange(
          event.target.value.length > 0 ? Number(event.target.value) : null,
        );
      else _onChange(event.target.value);
    }

    return (
      <input
        type={type}
        placeholder={placeholder ? t(placeholder) : ''}
        onChange={handleOnChange}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
