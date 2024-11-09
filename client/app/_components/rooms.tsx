'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DateFormat } from '@/app/_providers/intl/date-format';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Message } from '@/app/_providers/intl/message';
import { CreateRoomForm } from '@/app/rooms/_components/create-room-form';
import { JoinRoomForm } from '@/app/rooms/_components/join-room-form';
import { LogIn, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { gql, useQuery } from '@apollo/client';
import { Loader } from '@/components/ui/loader';
import { useQueryParam } from '@/lib/hooks/use-query-param';

type Room = {
  id: string;
  name: string;
  createdAt: string;
  lastMessage: {
    content: string;
    user: {
      username: string;
    };
  } | null;
};

export function Rooms({ className }: { className?: string }) {
  const { loading, error, data } = useQuery<{ listRooms: Room[] }>(gql`
    query ListRooms {
      listRooms(type: "member") {
        id
        name
        createdAt
        lastMessage {
          content
          user {
            username
          }
        }
      }
    }
  `);
  const { update, state } = useQueryParam('search', '');

  return (
    <Card
      className={cn(
        'flex flex-col p-2 w-full md:w-[21rem] bg-background h-[calc(100vh-5.5rem)]',
        className,
      )}>
      <CardHeader className="p-0 pb-4 space-y-2">
        <div className="flex flex-row items-center justify-between gap-2">
          <h2 className="text-2xl">
            <Message value="common.chats" />
          </h2>
          <div className="flex flex-row gap-2">
            <CreateRoomForm>
              <Button size="icon" variant="default" className="h-8 w-8">
                <Plus />
              </Button>
            </CreateRoomForm>
            <JoinRoomForm>
              <Button size="icon" variant="default" className="h-8 w-8">
                <LogIn />
              </Button>
            </JoinRoomForm>
          </div>
        </div>
        <div className="relative">
          <Input
            onChange={(_value) => update(_value.trim())}
            placeholder="common.search"
            value={state}
            className={state.trim() !== '' && 'pr-10'}
          />
          {state.trim() !== '' && (
            <Button
              onClick={() => update('')}
              variant="ghost"
              className="p-2 h-8 transform top-1/2 -translate-y-1/2 absolute right-1">
              <X />
            </Button>
          )}
        </div>
      </CardHeader>
      <div
        className={cn(
          'flex w-full items-center flex-col space-y-2',
          !loading && 'overflow-auto',
        )}>
        {loading ? (
          <Loader />
        ) : !error ? (
          data.listRooms
            .filter((room) => {
              if (state.trim() === '') return true;

              let result = room.name
                .toLowerCase()
                .match(
                  `.*${state.trim().toLowerCase().split('').join('.*')}.*`,
                );

              return !!result;
            })
            .map((room) => (
              <Link key={room.id} href={`/rooms/${room.id}`} className="w-full">
                <Card className="relative">
                  {room?.lastMessage && (
                    <Badge
                      variant="secondary"
                      className="absolute top-0 py-0 px-1 right-0 rounded-tl-none rounded-br-none rounded-tr-md rounded-bl-md">
                      <DateFormat value={room.createdAt} />
                    </Badge>
                  )}
                  <CardHeader className="p-2">
                    <CardTitle className="text-sm">{room.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex gap-2 pt-0 pb-2 px-2 relative">
                    <div className="flex flex-col space-y-1 items-center">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CF</AvatarFallback>
                      </Avatar>
                    </div>
                    {room?.lastMessage ? (
                      <div className=" flex-grow overflow-hidden justify-start text-xs w-full flex flex-col space-y-1">
                        <div className="flex">
                          <Badge
                            variant="default"
                            className="text-xs rounded-md py-0 px-1">
                            {room.lastMessage.user.username}
                          </Badge>
                        </div>

                        <p className="truncate">{room?.lastMessage.content}</p>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center flex-grow text-muted-foreground">
                        <Message value="rooms.noConversation" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))
        ) : (
          <></>
        )}
      </div>
    </Card>
  );
}
