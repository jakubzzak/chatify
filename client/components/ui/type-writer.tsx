"use client"

import {TypewriterProps, CursorProps, useTypewriter, Cursor} from "react-simple-typewriter";
import {useMessage} from "@/app/_providers/intl/message";
import {ReactNode, useState} from "react";

type TypeWriterProps = {
  value: string
  cursor?: boolean
  cursorStyle?: string | ReactNode
  skeleton?: ReactNode
} & Omit<TypewriterProps, "words" | "onLoopDone"> & Omit<CursorProps, "cursorStyle">

export function TypeWriter({
                             value,
                             cursorStyle = "|",
                             skeleton,
                             cursorBlinking = true,
                             cursorColor,
                             cursor = true,
                             ...props
                           }: TypeWriterProps) {
  const t = useMessage()
  const [enableCursor, setEnableCursor] = useState(true)

  const [text] = useTypewriter({
    words: [t(value)],
    onLoopDone: () => setTimeout(() => setEnableCursor(false), 3000),
    ...props,
  })

  return (
    <>
      {text}
      {enableCursor && <Cursor cursorBlinking={cursorBlinking} cursorStyle={cursorStyle} cursorColor={cursorColor}/>}
    </>
  )
}