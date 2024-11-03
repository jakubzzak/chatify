import { CreateRoomForm } from '@/app/rooms/_components/create-room-form';
import { JoinRoomForm } from '@/app/rooms/_components/join-room-form';
import { LogIn, MessageCirclePlus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Message } from '@/app/_providers/intl/message';
import { Rooms } from '@/app/_components/rooms';

export default function ChatPage() {
  return (
    <>
      <Rooms />
      <div className="md:flex flex-col h-[calc(100vh-5.5rem)] flex-grow justify-center items-center gap-10 hidden">
        <MessageCirclePlus className="h-48 w-48 text-muted-foreground" />
        <div className="flex flex-wrap gap-2">
          <CreateRoomForm>
            <Button variant="default">
              <Plus />
              <Message value="chatRoom.createNew" />
            </Button>
          </CreateRoomForm>
          <JoinRoomForm>
            <Button variant="default">
              <LogIn className="w-10 h-10 mr-2" />
              <Message value="chatRoom.joinExisting" />
            </Button>
          </JoinRoomForm>
        </div>
      </div>
    </>
  );
}
