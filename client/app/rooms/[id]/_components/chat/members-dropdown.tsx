'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { UsersRound } from 'lucide-react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { Loader } from '@/components/ui/loader';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Message } from '@/app/_providers/intl/message';

type Members = {
  members: {
    id: string;
    username: string;
    pictureUrl: string;
  }[];
};

export function MembersDropdown() {
  const params = useParams();
  const { loading, error, data } = useQuery<{ getRoom: Members }>(
    gql`
      query ($roomId: String!) {
        getRoom(roomId: $roomId) {
          members {
            username
            id
            pictureUrl
          }
        }
      }
    `,
    { variables: { roomId: params.id } },
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon">
          <UsersRound />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <Message value="chatRoom.members" />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : !error ? (
          data.getRoom.members.map((member) => (
            <DropdownMenuItem key={member.id} asChild>
              <Link href="/rooms">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={member.pictureUrl} />
                  <AvatarFallback>{member.username[0]}</AvatarFallback>
                </Avatar>
                <p className="text-sm">{member.username}</p>
              </Link>
            </DropdownMenuItem>
          ))
        ) : (
          <></>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
