import { Room } from '../types';

export const mapRoomRecordToRoom = (
  roomSnapshot:
    | FirebaseFirestore.QueryDocumentSnapshot<
        FirebaseFirestore.DocumentData,
        FirebaseFirestore.DocumentData
      >
    | FirebaseFirestore.DocumentSnapshot<
        FirebaseFirestore.DocumentData,
        FirebaseFirestore.DocumentData
      >,
): Room => {
  return {
    id: roomSnapshot.id,
    createdAt: roomSnapshot.createTime.toDate().toISOString(),
    name: roomSnapshot.data().name,
    code: roomSnapshot.data().code,
    isPersistent: roomSnapshot.data().isPersistent,
    members: [],
  };
};
