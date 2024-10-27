import { Chat } from '@/app/room/[id]/_components/chat';

export default function ChatRoomPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8.5rem)] px-4 pb-4 w-full items-center justify-center">
      <Chat />
    </div>
  );
}
