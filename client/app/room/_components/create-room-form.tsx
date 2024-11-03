'use client';

import { Message } from '@/app/_providers/intl/message';
import { Button } from '@/components/ui/button';
import { Form, useForm } from '@/components/form';
import { CreateRoomSchema } from '@/app/room/_components/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormedInput, FormedTabs } from '@/components/form/form-fields';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/_providers/auth';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useFetcher, useRevalidate } from '@/lib/hooks/use-fetch';
import { useState } from 'react';
import { InferType } from 'yup';

export function CreateRoomForm() {
  const form = useForm({
    defaultValues: CreateRoomSchema.getDefault(),
    resolver: yupResolver(CreateRoomSchema),
  });
  const router = useRouter();
  const { token } = useAuth();
  const { fetcher, errorHandler } = useFetcher();
  const mutate = useRevalidate();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: InferType<typeof CreateRoomSchema>) => {
    const _data = {
      ...data,
      isPersistent: data.isPersistent === 'true',
      isPrivate: data.isPrivate === 'true',
    };

    return fetcher('/rooms', {
      method: 'POST',
      body: _data,
      token,
    })
      .then((res) => {
        setOpen(false);
        mutate('/profile');
        router.push(`/room/${res.id}`);
      })
      .catch(errorHandler);
  };

  return (
    <Dialog onOpenChange={(_open) => setOpen(_open)} open={open}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="default"
          className="h-8 w-8"
          onClick={() => setOpen(true)}>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <Message value="chatRoom.createNew" />
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="create-room-form"
            className="space-y-4">
            <FormedInput name="name" label="chatRoom.name" />
            <div className="flex gap-2">
              <FormedTabs
                className=""
                name="isPersistent"
                values={[
                  {
                    value: 'true',
                    label: 'chatRoom.conversation.persistent',
                  },
                  {
                    value: 'false',
                    label: 'chatRoom.conversation.temporary',
                  },
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
          </form>
        </Form>
        <DialogFooter>
          <Button
            form="create-room-form"
            className="w-full"
            type="submit"
            loading={form.formState.isSubmitting}>
            <Message value="common.submit" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
