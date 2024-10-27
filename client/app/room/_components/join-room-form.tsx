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
import { JoinRoomSchema } from '@/app/room/_components/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormedInput } from '@/components/form/form-fields';

export function JoinRoomForm() {
  const form = useForm({
    defaultValues: JoinRoomSchema.getDefault(),
    resolver: yupResolver(JoinRoomSchema),
  });

  const onSubmit = () => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>
              <Message value="chatRoom.joinExisting" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormedInput name="name" label="chatRoom.code" />
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
