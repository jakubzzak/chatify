import { object, string } from '@/lib/yup';

export const CreateRoomSchema = object({
  name: string().required().default(null),
  isPersistent: string().required().default('true'),
  isPrivate: string().required().default('true'),
});

export const JoinRoomSchema = object({
  code: string().required().default(null),
});
