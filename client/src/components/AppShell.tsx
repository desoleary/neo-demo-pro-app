import React from 'react';
import Navigation from './Navigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
