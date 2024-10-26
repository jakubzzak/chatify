import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildMessage(message: string, locale: string, args?: {
  [key: string]: Date | number | string
}): string {
  if (!args) {
    return message
  }
  const handledArgs = Object.entries(args)
    .reduce((obj, [key, value]) => {
      if (value instanceof Date) {
        obj[key] = new Intl.DateTimeFormat(locale, {year: 'numeric', month: 'short', day: 'numeric'})
          .format(new Date(value))
      } else {
        obj[key] = value.toString()
      }

      return obj
    }, {})

  const injected = message.split(/{(\w+)}/g)
    .map(part => part in handledArgs ? handledArgs[part] : part)

  return injected.join('')
}
