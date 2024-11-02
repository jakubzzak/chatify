import { DocumentData } from 'firebase-admin/firestore';
import { UserEntity } from '../types';

export const mapUser = (userSnapshot: DocumentData): UserEntity => {
  return {
    id: userSnapshot.id,
    username: userSnapshot.data().username,
    pictureUrl: userSnapshot.data().pictureUrl,
    email: userSnapshot.data().email,
    rooms: userSnapshot.data().rooms,
  };
};
