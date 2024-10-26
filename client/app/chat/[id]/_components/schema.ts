import { object, string } from '@/lib/yup';

export const CreateRoomSchema = object({
  name: string().required().default(null),
});

export const JoinRoomSchema = object({
  code: string().required().default(null),
});
