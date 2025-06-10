import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-1 rounded-md text-xs font-medium', className)}>
      {children}
    </span>
  );
}
