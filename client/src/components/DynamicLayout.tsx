import React from 'react';

export function DynamicLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      <div>{children}</div>
    </div>
  );
}
