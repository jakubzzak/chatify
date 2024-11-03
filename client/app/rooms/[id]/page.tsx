import { Chat } from '@/app/room/[id]/_components/chat';

export default function ChatRoomPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] w-[calc(100vw-20rem)] items-center justify-center px-4">
      <Chat />
    </div>
  );
}
