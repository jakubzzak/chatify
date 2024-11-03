'use client';

import { useAuth } from '@/app/_providers/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User2 } from 'lucide-react';
import { Message } from '@/app/_providers/intl/message';
import { useState } from 'react';
import { Loader } from '@/components/ui/loader';

export function UserProfile() {
  const { user, endSession } = useAuth();
  const [loading, setLoading] = useState(false);

  const onSignOut = async () => {
    setLoading(true);
    return endSession().then(() => setLoading(false));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.pictureUrl} />
          <AvatarFallback>{user.username[0]}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User2 className="w-5 h-5 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSignOut} disabled={loading}>
          {loading ? (
            <Loader className="w-5 h-5 mr-2" />
          ) : (
            <LogOut className="w-5 h-5 mr-2" />
          )}
          <Message value="navbar.signOut" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
