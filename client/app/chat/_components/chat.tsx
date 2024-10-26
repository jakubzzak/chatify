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
import {useEffect} from "react";

export function Chat() {
  const {state} = useQueryParam("username", "jozo")
  const {socket} = useSocket({autoConnect: false, query: {username: state}})

  useEffect(() => {
    socket.connect()
  }, []);

  return (
    <Card className="flex flex-col w-[min(100%,500px)] h-[calc(100vh-9.5rem)] relative">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[calc(100vh-18.5rem)]">
        <Card className="flex-grow overflow-y-auto p-2">

        </Card>
      </CardContent>
      <CardFooter className="gap-2 absolute w-full bottom-0">
        <Input onChange={() => {}}/>
        <Button className="" size="icon">
          <SendHorizontal />
        </Button>
      </CardFooter>
    </Card>
  )
}
