'use client';

import { useEffect, useMemo, useState } from 'react';
import io, { ManagerOptions, Socket, SocketOptions } from 'socket.io-client';
import { useParams } from 'next/navigation';

export function useSocket(props?: Partial<ManagerOptions & SocketOptions>) {
  const params = useParams();
  const socket = useMemo<Socket>(
    () => io(process.env.NEXT_PUBLIC_BACKEND_URL + '/chat', props),
    [params?.id],
  );

  useEffect(() => {
    socket.on('disconnect', async () => {
      console.log('disconnect');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { socket };
}
