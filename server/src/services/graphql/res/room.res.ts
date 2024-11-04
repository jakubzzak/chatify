import { Room } from '@services/firebase/types';
import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

export const mapRoomResponse = (
  roomDoc:
    | QueryDocumentSnapshot<Omit<Room, 'id'>>
    | DocumentSnapshot<Omit<Room, 'id'>>,
) => {
  // console.log('room.map', roomDoc.data());

  const { code, createdAt, ...data } = roomDoc.data();
  return {
    id: roomDoc.id,
    createdAt: createdAt ?? roomDoc.createTime.toDate().toISOString(),
    isPrivate: !!code,
    ...data,
  };
};
