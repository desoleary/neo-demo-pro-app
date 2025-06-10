import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, CreditCard, Gift, ArrowRightLeft } from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Accounts', href: '/accounts', icon: CreditCard },
  { name: 'Rewards', href: '/rewards', icon: Gift },
  { name: 'Transfers', href: '/transfers', icon: ArrowRightLeft },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">FinTech Demo</h1>
          </div>
          <div className="flex space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
