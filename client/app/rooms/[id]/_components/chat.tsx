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
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { TypeWriter } from '@/components/ui/type-writer';
import { DateFormat } from '@/app/_providers/intl/date-format';
import { useFetch } from '@/lib/hooks/use-fetch';
import { useParams, useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { Message } from '@/app/_providers/intl/message';
import { useAuth } from '@/app/_providers/auth';
import { Room } from '@/app/rooms/_components/schema';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Rooms } from '@/app/_components/rooms';

type Message = {
  message: string;
  userId: string;
  username: string;
  createdAt: string;
};
type MetaEvent = { userId: string; username: string; type: string };

export function Chat() {
  const [message, setMessage] = useState(null);
  const messageRef = useRef<HTMLInputElement>(null);
  const [typingUser, setTypingUser] = useState<MetaEvent>(null);
  const params = useParams();
  const { data, loading, mutate } = useFetch<Room>(`/rooms/${params.id}`);
  const { socket, user } = useAuth();
  const router = useRouter();

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

      socket.on('message', (response: Message) => {
        mutate();
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

  if (loading) {
    return <Loading />;
  }

  return (
    <Card className="flex flex-col h-[calc(100vh-5.5rem)] flex-grow">
      <CardHeader className="flex flex-row items-center relative">
        <CardTitle>{data.name}</CardTitle>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="absolute md:hidden right-6 top-[0.75rem]">
              <AlignJustify />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 pt-4">
            <Rooms className="h-[calc(100vh-1rem)] border-0" />
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent className="flex h-[calc(100vh-14.5rem)] w-full">
        <Card className="flex-grow overflow-y-auto p-2 space-y-4">
          {data.messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex',
                message.userId === user.id ? 'justify-end' : 'justify-start',
              )}>
              <Card
                className={cn(
                  'w-10/12',
                  message.userId === user.id ? 'bg-accent' : 'bg-muted',
                )}>
                <CardHeader className="p-2 font-semibold">
                  <div className="flex justify-between">
                    <Badge>
                      {message.userId === user.id ? (
                        <Message value="common.me" />
                      ) : (
                        message.username
                      )}
                    </Badge>
                    <div className="text-xs">
                      <DateFormat value={message.createdAt} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col p-2">
                  <p className="text-xs">{message.content}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </Card>
      </CardContent>
      <CardFooter className="gap-2 w-full relative">
        {typingUser && (
          <div className="flex gap-2 absolute -top-5 items-center pl-2">
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
