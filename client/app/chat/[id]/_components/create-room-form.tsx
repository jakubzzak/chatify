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
import { CreateRoomSchema } from '@/app/chat/[id]/_components/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormedInput } from '@/components/form/form-fields';
import { fetchApi } from '@/lib/fetch';

export function CreateRoomForm() {
  const form = useForm({
    defaultValues: CreateRoomSchema.getDefault(),
    resolver: yupResolver(CreateRoomSchema),
  });

  const onSubmit = async (data) => {
    return fetchApi('/rooms', {
      method: 'POST',
      body: data,
      credentials: 'omit',
    })
      .then(() => console.log('aaaaaaaaaaaa'))
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
