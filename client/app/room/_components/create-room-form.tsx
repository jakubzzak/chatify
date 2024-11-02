'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Message } from '@/app/_providers/intl/message';
import { Button } from '@/components/ui/button';
import { Form, useForm } from '@/components/form';
import { CreateRoomSchema } from '@/app/room/_components/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormedInput, FormedTabs } from '@/components/form/form-fields';
import { fetchApi } from '@/lib/fetch';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_providers/auth';

export function CreateRoomForm() {
  const form = useForm({
    defaultValues: CreateRoomSchema.getDefault(),
    resolver: yupResolver(CreateRoomSchema),
  });
  const router = useRouter();
  const { token } = useAuth();

  const onSubmit = async (data) => {
    const _data = {
      ...data,
      isPersistent: data.isPersistent === 'true',
      isPrivate: data.isPrivate === 'true',
    };

    return fetchApi('/rooms', {
      method: 'POST',
      body: _data,
      token,
    })
      .then((res) => {
        router.push(`/room/${res.id}?username=${data.username}`);
      })
      .catch(() => console.log('eeeeeeeee'));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>
              <Message value="chatRoom.createNew" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormedInput name="name" label="chatRoom.name" />
            <div className="flex gap-2">
              <FormedTabs
                className=""
                name="isPersistent"
                values={[
                  { value: 'true', label: 'chatRoom.conversation.persistent' },
                  { value: 'false', label: 'chatRoom.conversation.temporary' },
                ]}
                label="chatRoom.conversation"
              />
              <FormedTabs
                name="isPrivate"
                values={[
                  { value: 'true', label: 'chatRoom.roomType.private' },
                  { value: 'false', label: 'chatRoom.roomType.public' },
                ]}
                label="chatRoom.roomType"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              type="submit"
              loading={form.formState.isSubmitting}>
              <Message value="common.submit" />
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
