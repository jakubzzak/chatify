'use client';

import { MessageType } from '@/app/_providers/intl/message';
import { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { useController } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  FormFieldContext,
} from '@/components/form/index';

type FormedInputProps<T extends (...args: any) => any> = Omit<
  Parameters<T>[0],
  'onChange' | 'nativeOnChange' | 'value' | 'defaultValue' | 'onValueChange'
> & {
  name: string;
  label?: MessageType | null;
  description?: MessageType;
  readOnly?: boolean;
};

type FormedValueItem = {
  value: string;
  label?: ReactNode | string;
};

export const FormedInput = (props: FormedInputProps<typeof Input>) => {
  const {
    field: { onChange, value },
    formState,
  } = useController(props);

  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <FormItem>
        {props.label && <FormLabel value={props.label} />}
        <FormControl>
          <Input
            {...{
              ...props,
              disabled: props.readOnly ? true : formState.disabled,
              onChange,
              value,
            }}
          />
        </FormControl>
        {props.description && <FormDescription value={props.description} />}
        <FormMessage />
      </FormItem>
    </FormFieldContext.Provider>
  );
};
