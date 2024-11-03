'use client';

import { useAuth } from '@/app/_providers/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DateFormat } from '@/app/_providers/intl/date-format';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Message } from '@/app/_providers/intl/message';
import { CreateRoomForm } from '@/app/rooms/_components/create-room-form';
import { JoinRoomForm } from '@/app/rooms/_components/join-room-form';
import { LogIn, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Rooms({ className }: { className?: string }) {
  const { user } = useAuth();

  return (
    <Card
      className={cn(
        'flex flex-col p-6 w-full md:w-[21rem] bg-background h-[calc(100vh-5.5rem)]',
        className,
      )}>
      <CardHeader className="p-0 pb-6 space-y-2">
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
        <Input onChange={() => {}} placeholder="common.search" />
      </CardHeader>
      <div className="flex flex-col overflow-y-auto space-y-4">
        {user.rooms.map((room) => (
          <Link key={room.id} href={`/rooms/${room.id}`}>
            <Card>
              <CardContent className="flex gap-6 pt-4 relative">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{room.name}</CardTitle>
                  <Badge className="absolute bottom-6 right-6">
                    <DateFormat value={room.createdAt} timeStyle={undefined} />
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Card>
  );
}
