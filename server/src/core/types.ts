export type Room = {
  id: string;
  createdAt: string;
  name: string;
  code: string;
  isPersistent: boolean;
  members: (string | User)[];
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
  createdAt: string;
  content: string;
  userId: string;
  roomId: string;
};
