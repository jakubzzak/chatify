import { useIntl } from '@/app/_providers/intl/intl-provider';
import { Skeleton } from '@/components/ui/skeleton';

type NativeIntlDateTimeFormatProps = ConstructorParameters<
  typeof Intl.DateTimeFormat
>[1];

type IntlDateFormatProps = NativeIntlDateTimeFormatProps &
  (
    | {
        children: string | Date;
        value?: undefined;
      }
    | {
        value: string | Date;
        children?: undefined;
      }
  );

export function formatDate(
  locale: string,
  date: Date,
  options: NativeIntlDateTimeFormatProps = {},
) {
  if (!date) return null;

  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeStyle: 'short',
    ...options,
  }).format(date);
}

export const DateFormat = ({
  value,
  children,
  ...options
}: IntlDateFormatProps) => {
  const { locale } = useIntl();

  if (!locale) return <Skeleton className="w-24 my-1 h-4" />;

  const dateInput = value ?? children;
  const date = dateInput ? new Date(dateInput) : null;

  return formatDate(locale, date, options);
};
