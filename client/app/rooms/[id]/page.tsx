import { Chat } from '@/app/rooms/[id]/_components/chat';
import { Rooms } from '@/app/_components/rooms';

export default function ChatRoomPage() {
  return (
    <>
      <Rooms className="hidden md:flex" />
      <Chat />
    </>
  );
}
