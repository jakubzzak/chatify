import { Timestamp } from 'firebase-admin/firestore';

export type Room = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  admin: string;
  code: string;
  isPersistent: boolean;
  members: (string | User)[];
  messages: Message[];
};

export type User = {
  id: string;
  email: string;
  pictureUrl?: string | null;
  username: string;
  rooms: string[];
};

export type Message = {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  userId: string;
  content: string;
};
