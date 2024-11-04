export enum FirebaseCollections {
  Users = 'users',
  Rooms = 'rooms',
}
export type Room = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  admin: string;
  code: string | null;
  isPersistent: boolean;
  members: string[];
};

export type User = {
  id: string;
  email: string;
  pictureUrl: string | null;
  username: string;
  rooms: string[];
};

export enum FirebaseRoomSubCollections {
  Messages = 'messages',
}
export type Message = {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  content: string;
};
