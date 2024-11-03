import { Message, Room, User } from '@core/types';
import { RoomMessageResponse } from '@domains/room/responses/message.res';
import { RoomResponse } from '@domains/room/responses/room.res';
import { RoomMemberResponse } from '@domains/room/responses/user.res';
import { DocumentData, DocumentSnapshot } from 'firebase-admin/firestore';

export const mapRoomDocToRoomResponse = (
  roomDoc: DocumentData,
  roomMessages?: DocumentSnapshot<Omit<Message, 'id'>>[],
  roomMembers?: DocumentData[],
): RoomResponse => {
  const membersMap = new Map<string, string>(
    roomMembers?.map((member) => [member.id, member.data().username]) ?? [],
  );

  return {
    id: roomDoc.id,
    createdAt: roomDoc.createTime.toDate().toISOString(),
    name: roomDoc.data().name,
    isPersistent: roomDoc.data().isPersistent,
    isPrivate: !!roomDoc.data().code,
    members: roomMembers?.map(mapRoomMemberDoc) ?? [],
    messages:
      roomMessages?.map((message) => mapRoomMessageDoc(message, membersMap)) ??
      [],
  };
};

export const mapRoomToRoomResponse = (
  roomSnapshot: DocumentSnapshot<Omit<Room, 'id' | 'messages'>, DocumentData>,
  roomMessages?: DocumentSnapshot<Omit<Message, 'id'>>[],
  roomMembers?: DocumentSnapshot<Omit<User, 'id'>>[],
): RoomResponse => {
  console.log('room to res', roomSnapshot);
  const room = roomSnapshot.data();
  const membersMap = new Map<string, string>(
    room.members?.map((member) => {
      if (typeof member === 'string') {
        return [member, member];
      }
      return [member.id, member.username];
    }) ?? [],
  );

  const res = {
    id: roomSnapshot.id,
    createdAt: room.createdAt ?? roomSnapshot.createTime.toDate().toISOString(),
    name: room.name,
    isPersistent: room.isPersistent,
    isPrivate: !!room.code,
    members: undefined,
    messages: undefined,
  };

  if (roomMembers) {
    res.members = roomMembers?.map(mapRoomMemberDoc);
  }
  if (roomMessages) {
    res.messages = roomMessages?.map((message) =>
      mapRoomMessageDoc(message, membersMap),
    );
  }

  return res;
};

const mapRoomMemberDoc = (member: DocumentData): RoomMemberResponse => {
  return {
    id: member.id,
    username: member.data().username,
    pictureUrl: member.data().pictureUrl,
  };
};

const mapRoomMessageDoc = (
  message: DocumentSnapshot<Omit<Message, 'id'>>,
  membersMap: Map<string, string>,
): RoomMessageResponse => {
  return {
    id: message.id,
    createdAt: message.data().createdAt.toDate().toISOString(),
    userId: message.data().userId,
    username: membersMap.get(message.data().userId) ?? 'Anonymous Crocodile 🐊',
    content: message.data().content,
  };
};
