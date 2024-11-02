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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

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

const Label = ({
  label,
  value,
}: {
  value?: string;
  label: ReactNode | MessageType | ((t: MessageFunction) => string);
}) => {
  const t = useMessage();

  if (typeof label === 'function') {
    label = label(t);
  } else if (typeof label === 'string') {
    label = t(label);
  } else if (!label) {
    label = value;
  }

  return label;
};

export const FormedTabs = (
  props: FormedInputProps<typeof Tabs> & { values: FormedValueItem[] },
) => {
  const {
    field: { onChange, value },
    formState,
  } = useController(props);

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
              {props.values.map(({ value, label }) => (
                <TabsTrigger
                  key={value}
                  {...{
                    value,
                    children: <Label {...{ label, value }} />,
                    disabled: formState.disabled,
                  }}
                />
              ))}
            </TabsList>
          </Tabs>
        </FormControl>
        {props.description && <FormDescription value={props.description} />}
        <FormMessage />
      </FormItem>
    </FormFieldContext.Provider>
  );
};

export const FormedSelect = (
  props: FormedInputProps<typeof Select> & { values: FormedValueItem[] },
) => {
  const {
    field: { onChange, value },
    formState,
  } = useController(props);

  function handleOnChange(...args) {
    if (!formState.disabled) onChange(...args);
  }

  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <FormItem>
        {props.label && <FormLabel value={props.label} />}
        <FormControl>
          <Select onValueChange={handleOnChange}>
            <SelectTrigger>
              {/* @ts-ignore */}
              {props.values.find((item) => item.value === value)?.label}
            </SelectTrigger>
            <SelectContent>
              {props.values.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  <Label {...{ label, value }} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
