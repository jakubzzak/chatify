import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Message } from '@/app/_providers/intl/message';
import { CreateRoomForm } from '@/app/chat/[id]/_components/create-room-form';
import { JoinRoomForm } from '@/app/chat/[id]/_components/join-room-form';

export default function ChatRoomPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8.5rem)] px-4 pb-4 w-full items-center justify-center">
      <Tabs defaultValue="createRoom" className="w-[400px]">
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
