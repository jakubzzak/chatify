import { object, string } from '@/lib/yup';
import { User } from '@/app/_providers/auth';

export const CreateRoomSchema = object({
  name: string().required().default(null),
  isPersistent: string().required().default('true'),
  isPrivate: string().required().default('true'),
});

export const JoinRoomSchema = object({
  type: string().nullable().default('private'),
  code: string()
    .when('type', {
      is: 'private',
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    })
    .default(null),
  roomId: string()
    .when('type', {
      is: 'public',
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.nullable(),
    })
    .default(null),
});

export type Room = {
  id: string;
  createdAt: string;
  isPresent: boolean;
  name: string;
  members: User[];
};
