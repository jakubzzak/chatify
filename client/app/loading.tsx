import { Loader } from '@/components/ui/loader';

export default function Loading() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-8.5rem)] px-4 pb-4 w-full items-center justify-center">
      <Loader />
    </div>
  );
}
