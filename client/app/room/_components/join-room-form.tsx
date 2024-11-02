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
import { JoinRoomSchema, Room } from '@/app/room/_components/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  FormedInput,
  FormedSelect,
  FormedTabs,
} from '@/components/form/form-fields';
import { useFetch, useFetcher } from '@/lib/hooks/use-fetch';
import { InferType } from '@/lib/yup';
import { useRouter } from 'next/navigation';

export function JoinRoomForm() {
  const form = useForm({
    defaultValues: JoinRoomSchema.getDefault(),
    resolver: yupResolver(JoinRoomSchema),
  });
  const [type] = form.watch(['type']);
  const { data, loading } = useFetch<Room[]>('/rooms?excludeSelf=true');
  const { fetcher, errorHandler } = useFetcher();
  const router = useRouter();

  const onSubmit = (data: InferType<typeof JoinRoomSchema>) => {
    return fetcher('/rooms/join', { method: 'POST', body: data })
      .then((res) => router.push(res?.id))
      .catch(errorHandler);
  };

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
