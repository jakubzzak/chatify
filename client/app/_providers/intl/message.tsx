"use client"

import {useIntl} from "@/app/_providers/intl/intl-provider"
import {buildMessage} from "@/lib/utils"
import type Json from "@/app/_providers/intl/locales/en.json"

export type MessageType = keyof typeof Json | string
export type MessageFunction = (key: MessageType, args?: {}) => string

export const useMessage = () => {
  const {messages, locale} = useIntl()

  function getTranslation(key: MessageType, args?: {}) {
    if (!key || !messages[key]) {
      return key
    } else if (!args) {
      return messages[key]
    }
    return buildMessage(messages[key], locale, args)
  }

  return getTranslation
}

export type MessageProps = {
  value: MessageType
  args?: {}
}

export const Message = ({args, value}: MessageProps) => {
  const t = useMessage()

  return t(value, args)
}