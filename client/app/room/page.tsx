import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Message } from '@/app/_providers/intl/message';
import { CreateRoomForm } from '@/app/room/_components/create-room-form';
import { JoinRoomForm } from '@/app/room/_components/join-room-form';
import { Rooms } from '@/app/_components/rooms';

export default function ChatPage() {
  return (
    <div className="flex gap-2">
      <Rooms />
      <Tabs defaultValue="joinRoom" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="createRoom">
            <Message value="chatRoom.createNew" />
          </TabsTrigger>
          <TabsTrigger value="joinRoom">
            <Message value="chatRoom.joinExisting" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="createRoom">
          <CreateRoomForm />
        </TabsContent>
        <TabsContent value="joinRoom">
          <JoinRoomForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
