import { object, string } from '@/lib/yup';

export const EmailSchema = object({
  email: string().email().required().default(null),
});
