export type Room = {
  id: string;
  createdAt: string;
  name: string;
  code: string;
  isPersistent: boolean;
  members: string[];
};

export type User = {
  id: string;
  email: string;
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
