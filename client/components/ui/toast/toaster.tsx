'use client';

import { useToast } from '@/components/ui/toast/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastIcon,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast/toast';
import { useMessage } from '@/app/_providers/intl/message';

export function Toaster() {
  const { toasts } = useToast();
  const t = useMessage();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        variant,
        duration,
        description,
        action,
        ...props
      }) {
        return (
          <Toast
            key={id}
            duration={duration ? duration : 5000}
            {...props}
            variant={variant}>
            <ToastIcon variant={variant} />
            <div className="grid gap-1">
              {title && (
                <ToastTitle>
                  {typeof title === 'function' ? title(t) : t(title)}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription>
                  {typeof description === 'function'
                    ? description(t)
                    : t(description)}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
