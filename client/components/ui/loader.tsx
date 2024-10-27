import { Loader2, LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as React from 'react';

export const Loader = ({ className, ...props }: LucideProps) => {
  return (
    <Loader2 className={cn('w-8 h-8 animate-spin', className)} {...props} />
  );
};
