import { Message } from '@services/firebase/types';
import {
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';

export const mapMessageResponse = (
  messageDoc:
    | QueryDocumentSnapshot<Omit<Message, 'id'>>
    | DocumentSnapshot<Omit<Message, 'id'>>,
) => {
  console.log('message.map', messageDoc.data());
  return {
    id: messageDoc.id,
    createdAt: messageDoc.createTime.toDate().toISOString(),
    ...messageDoc.data(),
  };
};
