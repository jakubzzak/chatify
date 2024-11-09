import { Loader } from '@/components/ui/loader';
import { cn } from '@/lib/utils';

export default function Loading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col min-h-screen px-4 pb-4 w-full items-center justify-center',
        className,
      )}>
      <Loader />
    </div>
  );
}
