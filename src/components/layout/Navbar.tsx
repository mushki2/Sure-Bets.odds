'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold tracking-tight hover:text-green-400 transition-colors">
              SureBets Odds
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/predictions" className="hover:text-green-400 transition-colors">Predictions</Link>
              <Link href="/odds" className="hover:text-green-400 transition-colors">Odds</Link>
              <Link href="/arbitrage" className="hover:text-green-400 transition-colors">Arbitrage</Link>
              <Link href="/custom" className="hover:text-green-400 transition-colors">Custom</Link>
              <Link href="/livescore" className="hover:text-green-400 transition-colors">Live</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm hidden sm:inline">{user.email}</span>
                <Button variant="outline" size="sm" onClick={logout} className="text-white border-white hover:bg-white hover:text-blue-900">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-blue-800">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="secondary" size="sm" className="bg-green-500 hover:bg-green-600 text-white border-none">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
