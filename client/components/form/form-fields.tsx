'use client';

import {
  MessageFunction,
  MessageType,
  useMessage,
} from '@/app/_providers/intl/message';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  label?: ReactNode | MessageType | ((t: MessageFunction) => string);
};

export const FormedTabs = (
  props: FormedInputProps<typeof Tabs> & { values: FormedValueItem[] },
) => {
  const {
    field: { onChange, value },
    formState,
  } = useController(props);
  const t = useMessage();

  function handleOnChange(...args) {
    if (!formState.disabled) onChange(...args);
  }

  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <FormItem>
        {props.label && <FormLabel value={props.label} />}
        <FormControl>
          <Tabs value={value} onValueChange={handleOnChange}>
            <TabsList>
              {props.values.map(({ value, label }) => {
                if (typeof label === 'function') {
                  label = label(t);
                } else if (typeof label === 'string') {
                  label = t(label);
                } else if (!label) {
                  label = value;
                }

                return (
                  <TabsTrigger
                    key={value}
                    {...{
                      value,
                      children: label,
                      disabled: formState.disabled,
                    }}
                  />
                );
              })}
            </TabsList>
          </Tabs>
        </FormControl>
        {props.description && <FormDescription value={props.description} />}
        <FormMessage />
      </FormItem>
    </FormFieldContext.Provider>
  );
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
