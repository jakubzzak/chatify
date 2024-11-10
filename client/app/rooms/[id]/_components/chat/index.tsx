'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlignJustify, SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { TypeWriter } from '@/components/ui/type-writer';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/_providers/auth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Rooms } from '@/app/_components/rooms';
import { useQuery } from '@apollo/client';
import { MembersDropdown } from '@/app/rooms/[id]/_components/chat/members-dropdown';
import { Messages } from '@/app/rooms/[id]/_components/chat/messages';
import { GET_ROOM, GET_ROOM_MESSAGES } from '@/app/_providers/graphql/queries';
import { Skeleton } from '@/components/ui/skeleton';
import { useGraphql } from '@/app/_providers/graphql';

type MetaEvent = { userId: string; username: string; type: string };

type Room = {
  id: string;
  name: string;
};

export function Chat() {
  const [message, setMessage] = useState('');
  const messageRef = useRef<HTMLInputElement>(null);
  const [typingUser, setTypingUser] = useState<MetaEvent>(null);
  const params = useParams();
  const { socket, user } = useAuth();
  const router = useRouter();
  const { loading, error, data, refetch } = useQuery<{ getRoom: Room }>(
    GET_ROOM,
    { variables: { roomId: params.id } },
  );
  const { client } = useGraphql();

  useEffect(() => {
    return () => {
      socket.off('message', () => {});
      socket.off('meta', () => {});
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      socket.connect();

      socket.on('connect', () => {
        console.log('connect');
      });

      socket.on('disconnect', () => {
        router.push('/room');
      });

      socket.on('message', () => {
        client.refetchQueries({ include: [GET_ROOM_MESSAGES] });
      });
      socket.on('meta', (response) => {
        if (response?.type === 'typing_start') {
          setTypingUser(response);
        } else if (response?.type === 'typing_end') {
          setTypingUser(null);
        }
      });
    }
  }, [data, loading]);

  const onSendMessage = () => {
    socket.emit('message', { message });
    setMessage('');

    if (messageRef?.current?.value) {
      messageRef.current.value = '';
    }
  };

  const onFocus = () => {
    socket.emit('meta', { type: 'typing_start' });
  };

  const onBlur = () => {
    socket.emit('meta', { type: 'typing_end' });
  };

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && messageRef?.current?.value) {
      onSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-5.5rem)] flex-grow">
      <CardHeader className="space-y-0 flex p-2 flex-row flex-wrap items-center justify-between relative">
        <CardTitle className="text-lg sm:text-2xl">
          {loading ? (
            <Skeleton className="h-8 w-34" />
          ) : !error ? (
            data.getRoom.name
          ) : (
            <></>
          )}
        </CardTitle>

        <div className="space-x-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" className="md:hidden">
                <AlignJustify />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 pt-4">
              <Rooms className="h-[calc(100vh-1rem)] pt-6 border-0" />
            </SheetContent>
          </Sheet>
          <MembersDropdown />
        </div>
      </CardHeader>
      <CardContent className="flex pb-2 px-2 h-[calc(100vh-13rem)] w-full">
        <Messages />
      </CardContent>
      <CardFooter className="pb-2 pt-4 px-2 gap-2 w-full relative">
        {typingUser && (
          <div className="flex gap-1 absolute -top-[0.2rem] items-center pl-2">
            <p className="text-xs leading-4">{typingUser.username}</p>
            <p className="text-lg leading-4">
              <TypeWriter
                value={'...'}
                loop={true}
                enableCursor={false}
                typeSpeed={300}
              />
            </p>
          </div>
        )}
        <div className="flex w-full gap-2">
          <Input
            ref={messageRef}
            onChange={(value) => setMessage(value)}
            value={message}
            onFocus={onFocus}
            onBlur={onBlur}
            // onKeyDown={onKeyDown}
          />
          <Button
            size="icon"
            onKeyDown={onKeyDown}
            onClick={onSendMessage}
            disabled={!messageRef?.current?.value}>
            <SendHorizontal />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
