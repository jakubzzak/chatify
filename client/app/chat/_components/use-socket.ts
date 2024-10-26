"use client"

import { useEffect, useState } from 'react'
import io, { ManagerOptions, Socket, SocketOptions } from 'socket.io-client'

export function useSocket(props?: Partial<ManagerOptions & SocketOptions>) {
  const [socket, _] = useState<Socket>(io(process.env.NEXT_PUBLIC_BACKEND_URL + "/chat", props))

  useEffect(() => {
    // socket.on('progress', (data) => {
    //   console.log(data, 'progres')
    // })
    //
    // socket.on('complete', (data) => {
    //   console.log(data.message, 'complete')
    //   setTimeout(() => {
    //     socket.disconnect()
    //   }, 2000)
    // })
    //
    socket.on("disconnect", async () => {
      console.log('disconnect')
    })

    return () => {socket.disconnect()}
  }, [])

  return {socket}
}