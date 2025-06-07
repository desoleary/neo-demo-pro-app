import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './hooks/apolloClient';
import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { AccountsPage } from './pages/AccountsPage';
import { RewardsPage } from './pages/RewardsPage';
import { TransfersPage } from './pages/TransfersPage';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/accounts" element={<AccountsPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/transfers" element={<TransfersPage />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </ApolloProvider>
  );
}
