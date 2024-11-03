'use client';

import { Message } from '@/app/_providers/intl/message';
import { Button } from '@/components/ui/button';
import { Form, useForm } from '@/components/form';
import { JoinRoomSchema, Room } from '@/app/rooms/_components/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  FormedInput,
  FormedSelect,
  FormedTabs,
} from '@/components/form/form-fields';
import { useFetch, useFetcher } from '@/lib/hooks/use-fetch';
import { InferType } from '@/lib/yup';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LogIn } from 'lucide-react';
import { useState } from 'react';

export function JoinRoomForm() {
  const form = useForm({
    defaultValues: JoinRoomSchema.getDefault(),
    resolver: yupResolver(JoinRoomSchema),
  });
  const [type] = form.watch(['type']);
  const { data, loading } = useFetch<Room[]>('/rooms?excludeSelf=true');
  const { fetcher, errorHandler } = useFetcher();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onSubmit = (data: InferType<typeof JoinRoomSchema>) => {
    return fetcher('/rooms/join', { method: 'POST', body: data })
      .then((res) => {
        setOpen(false);
        router.push(`/rooms/${res?.id}`);
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
          <LogIn />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            <Message value="chatRoom.joinExisting" />
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="join-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4">
            <FormedTabs
              name="type"
              values={[
                {
                  value: 'private',
                  label: 'chatRoom.roomType.private',
                },
                { value: 'public', label: 'chatRoom.roomType.public' },
              ]}
            />
            {type === 'private' && (
              <FormedInput name="code" label="chatRoom.code" />
            )}
            {type === 'public' && (
              <FormedSelect
                name="roomId"
                label="chatRoom.name"
                values={
                  loading
                    ? []
                    : data.map((item) => ({
                        value: item.id,
                        label: <p>{item.name}</p>,
                      }))
                }
              />
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button
            form="join-form"
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
