'use client';

import { Form, useForm } from '@/components/form';
import { EmailSchema } from '@/app/_components/schema';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormedInput } from '@/components/form/form-fields';
import { Button } from '@/components/ui/button';
import { Message } from '@/app/_providers/intl/message';
import { sendSignInLinkToEmail } from '@firebase/auth';
import { auth } from '@/app/firebase-config';

export function LoginForm() {
  const form = useForm({
    defaultValues: EmailSchema.getDefault(),
    resolver: yupResolver(EmailSchema),
  });

  const onSubmit = (data) => {
    const actionCodeSettings = {
      url: 'http://localhost:3000/room',
      handleCodeInApp: true,
    };

    sendSignInLinkToEmail(auth, data.email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', data.email);
      })
      .catch((error) => {});
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormedInput name="email" label="email" />
        <Button type="submit" loading={form.formState.isSubmitting}>
          <Message value="common.submit" />
        </Button>
      </form>
    </Form>
  );
}
