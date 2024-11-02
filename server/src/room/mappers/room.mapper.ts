import { RoomResponse } from '@core/responses/room.res';
import { Room } from '@core/types';
import { DocumentData } from 'firebase-admin/firestore';

export const mapRoomRecordToRoomResponse = (
  roomSnapshot:
    | FirebaseFirestore.QueryDocumentSnapshot<
        FirebaseFirestore.DocumentData,
        FirebaseFirestore.DocumentData
      >
    | FirebaseFirestore.DocumentSnapshot<
        FirebaseFirestore.DocumentData,
        FirebaseFirestore.DocumentData
      >,
  roomMembers?: DocumentData[],
): RoomResponse => {
  return {
    id: roomSnapshot.id,
    createdAt: roomSnapshot.createTime.toDate().toISOString(),
    name: roomSnapshot.data().name,
    isPersistent: roomSnapshot.data().isPersistent,
    isPrivate: !!roomSnapshot.data().code,
    members: roomMembers?.map(mapRoomMember) ?? [],
  };
};

export const mapRoomToRoomResponse = (room: Room): RoomResponse => {
  return {
    id: room.id,
    createdAt: room.createdAt,
    name: room.name,
    isPersistent: room.isPersistent,
    isPrivate: !!room.code,
    members: room.members.map(mapRoomMember),
  };
};

const mapRoomMember = (member: any): any => {
  return {
    id: member.id,
    username: member.username,
    pictureUrl: member.pictureUrl,
  };
};
