export type UserEntity = {
  id: string;
  email: string;
  pictureUrl: string | null;
  username: string;
  rooms: (string | UserRoom)[];
};

type UserRoom = {
  id: string;
  createdAt: string;
  name: string;
  isPersistent: boolean;
};
