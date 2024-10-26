"use client"

import {createContext, useContext, useState, useEffect, ReactNode} from "react"
import {useLocalStorage} from "@/lib/hooks/use-locale-storage";
import {LOCALES} from "@/lib/constants";

type IntlProviderProps = {
  children: ReactNode,
  defaultLocale?: string
};

type IntlProviderState = {
  locale: string
  setLocale: (locale: string) => void
  messages: { [key: string]: string }
  loading: boolean
};

const initialState = {
  locale: "en",
  setLocale: () => null,
  messages: {},
  loading: true,
};

const IntlProviderContext =
  createContext<IntlProviderState>(initialState);

export function IntlProvider({children, defaultLocale, ...props}: IntlProviderProps) {
  const [messages, setMessages] = useState({})
  const [loading, setLoading] = useState(true)
  const [locale, setLocale] = useLocalStorage("locale",
    defaultLocale ? defaultLocale : LOCALES[0])

  useEffect(() => {
    setLoading(true)

    import(`./locales/${locale}.json`)
      .then(setMessages)
      .finally(() => setLoading(false))
  }, [locale])

  return (
    <IntlProviderContext.Provider
      {...props}
      value={{
        locale,
        setLocale,
        messages,
        loading,
      }}
    >
      {!loading && children}
    </IntlProviderContext.Provider>
  );
}

export const useIntl = () => {
  const context = useContext(IntlProviderContext)

  if (context === undefined)
    throw new Error("useIntl must be used within a IntlProvider")

  return context;
};
