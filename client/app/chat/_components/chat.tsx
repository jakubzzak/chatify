"use client"

import {useSocket} from "@/app/chat/_components/use-socket";
import {Button} from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input";
import {SendHorizontal} from "lucide-react";
import {useQueryParam} from "@/lib/hooks/use-query-param";
import {useEffect, useRef, useState} from "react";
import {cn} from "@/lib/utils";
import {Badge} from "@/components/ui/badge";

type Message = { message: string, userId: string, username: string }

export function Chat() {
  const {state} = useQueryParam("username", "jozo")
  const {socket} = useSocket({autoConnect: false, query: {username: state}})
  const [message, setMessage] = useState(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [id, setId] = useState(null)
  const messageRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    socket.connect()

    socket.on("connect", () => {
      setId(socket.id)
    })

    socket.on("message", (response: Message) => {
      setMessages(prev => [...prev, response])
    })
    socket.on("meta", () => {})

    return () => {
      socket.off("message", () => {

      })
      socket.off("meta", () => {

      })
    }
  }, []);

  const onSendMessage = () => {
    socket.emit("message", {message})
    setMessage("")

    if (messageRef?.current?.value) {
      messageRef.current.value = ""
    }
  }

  return (
    <Card className="flex flex-col w-[min(100%,500px)] h-[calc(100vh-9.5rem)] relative">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[calc(100vh-18.5rem)]">
        <Card className="flex-grow overflow-y-auto p-2 space-y-4">
          {messages.map((_message, index) => (
            <div key={index} className={cn("flex", _message.userId === id ? "justify-end" : "justify-start" )}>
              <Card className={cn("w-10/12", _message.userId === id ? "bg-accent" : "bg-muted")}>
                <CardHeader className="p-2 font-semibold">
                  <div>
                    <Badge>
                      {_message.userId === id ? "Me" : _message.username}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col p-2">
                  <p className="text-xs">{_message.message}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </Card>
      </CardContent>
      <CardFooter className="gap-2 absolute w-full bottom-0">
        <Input ref={messageRef} onChange={(value) => setMessage(value)} value={message}/>
        <Button size="icon" onClick={onSendMessage}>
          <SendHorizontal/>
        </Button>
      </CardFooter>
    </Card>
  )
}
