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
import { SendHorizontal } from 'lucide-react';
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

type Message = {
  message: string;
  userId: string;
  username: string;
  createdAt: string;
};
type MetaEvent = { userId: string; username: string; type: string };

export function Chat() {
  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [id, setId] = useState(null);
  const messageRef = useRef<HTMLInputElement>(null);
  const [typingUser, setTypingUser] = useState<MetaEvent>(null);
  const params = useParams();
  const { data, loading } = useFetch(`/rooms/${params.id}`);
  const { socket } = useAuth();
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
        console.log(socket);
        // setId(socket.handshake.address);
      });

      socket.on('disconnect', () => {
        router.push('/room');
        console.log('aaaaaaaaaaaaaaaa');
      });

      socket.on('message', (response: Message) => {
        setMessages((prev) => [...prev, response]);
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
    <Card className="flex flex-col w-[min(100%,500px)] h-[calc(100vh-10rem)]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[calc(100vh-18.5rem)]">
        <Card className="flex-grow overflow-y-auto p-2 space-y-4">
          {messages.map((_message, index) => (
            <div
              key={index}
              className={cn(
                'flex',
                _message.userId === id ? 'justify-end' : 'justify-start',
              )}>
              <Card
                className={cn(
                  'w-10/12',
                  _message.userId === id ? 'bg-accent' : 'bg-muted',
                )}>
                <CardHeader className="p-2 font-semibold">
                  <div className="flex justify-between">
                    <Badge>
                      {_message.userId === id ? (
                        <Message value="common.me" />
                      ) : (
                        _message.username
                      )}
                    </Badge>
                    <div className="text-xs">
                      <DateFormat value={_message.createdAt} />
                    </div>
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
