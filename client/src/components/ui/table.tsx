import React from 'react';
import { cn } from '../../lib/utils';

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return <table className={cn('min-w-full text-sm', className)}>{children}</table>;
}

export function TableHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <thead className={cn('bg-gray-50', className)}>{children}</thead>;
}

export function TableBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={cn('border-b', className)}>{children}</tr>;
}

export function TableHead({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={cn('px-4 py-2 text-left font-medium', className)}>{children}</th>;
}

export function TableCell({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn('px-4 py-2', className)}>{children}</td>;
}
