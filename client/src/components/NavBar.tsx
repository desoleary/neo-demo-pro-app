import React from 'react';
import { Link } from 'react-router-dom';

export function NavBar() {
  return (
    <nav className="bg-gray-800 text-white p-2 flex space-x-4">
      <Link to="/" className="hover:underline">
        Dashboard
      </Link>
      <Link to="/users" className="hover:underline">
        Users
      </Link>
      <Link to="/accounts" className="hover:underline">
        Accounts
      </Link>
      <Link to="/rewards" className="hover:underline">
        Rewards
      </Link>
      <Link to="/transfers" className="hover:underline">
        Transfers
      </Link>
    </nav>
  );
}
