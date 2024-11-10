'use client';

import { useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { DateFormat } from '@/app/_providers/intl/date-format';
import { useAuth } from '@/app/_providers/auth';
import { Message } from '@/app/_providers/intl/message';
import { Loader } from '@/components/ui/loader';
import { GET_ROOM_MESSAGES } from '@/app/_providers/graphql/queries';

type Messages = {
  messages: {
    id: string;
    createdAt: string;
    content: string;
    user: {
      id: string;
      username: string;
    };
  }[];
};

export function Messages() {
  const params = useParams();
  const { user } = useAuth();
  const { loading, error, data } = useQuery<{ getRoom: Messages }>(
    GET_ROOM_MESSAGES,
    { variables: { roomId: params.id } },
  );

  return (
    <Card className="flex-grow overflow-y-auto p-2 space-y-4">
      {loading ? (
        <div className="flex h-full items-center justify-center">
          <Loader />
        </div>
      ) : !error ? (
        data.getRoom.messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex',
              message.user.id === user.id ? 'justify-end' : 'justify-start',
            )}>
            <Card
              className={cn(
                'w-10/12',
                message.user.id === user.id ? 'bg-accent' : 'bg-muted',
              )}>
              <CardHeader className="p-0 pb-2 font-semibold">
                <div className="flex justify-between">
                  <Badge className="py-0 text-xs rounded-bl-none rounded-br-md rounded-tr-none rounded-tl-md">
                    {message.user.id === user.id ? (
                      <Message value="common.me" />
                    ) : (
                      message.user.username
                    )}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="px-1 py-0 right-0 rounded-tl-none rounded-br-none rounded-tr-md rounded-bl-md">
                    <DateFormat value={message.createdAt} />
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col p-2">
                <p className="text-xs">{message.content}</p>
              </CardContent>
            </Card>
          </div>
        ))
      ) : (
        <></>
      )}
    </Card>
  );
}
