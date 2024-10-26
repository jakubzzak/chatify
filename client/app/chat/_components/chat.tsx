"use client"

import {useFetch} from "@/lib/hooks/use-fetch";
import {useSocket} from "@/app/chat/_components/use-socket";
import {Button} from "@/components/ui/button";

export function Chat() {
  const {data} = useFetch("/group")
  const {socket} = useSocket({autoConnect: false})


  const onConnect = () => {
    socket.connect()

    socket.on("connect", async () => {
      console.log('connect')
    })

    socket.emit("message", { test: "test" })

  }

  return (
    <div>
      <Button onClick={onConnect}>
        connect
      </Button>
    </div>
  )
}