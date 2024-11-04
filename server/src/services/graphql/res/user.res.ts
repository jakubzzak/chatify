import { User } from '@services/firebase/types';
import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

export const mapUserResponse = (
  userDoc:
    | QueryDocumentSnapshot<Omit<User, 'id'>>
    | DocumentSnapshot<Omit<User, 'id'>>,
) => {
  return {
    id: userDoc.id,
    createdAt: userDoc.createTime.toDate().toISOString(),
    ...userDoc.data(),
  };
};
