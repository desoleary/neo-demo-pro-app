import React from 'react';
import { NavBar } from './NavBar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
