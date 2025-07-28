// src/pages/DashboardPage.jsx
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const DashboardPage = ({ user }) => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">F.I.R.E. Dashboard</h1>
        <div className='flex items-center gap-4'>
          <p>{user.email}</p>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <main>
        <p>Selamat datang! Di sinilah semua proyek laporan Anda akan muncul.</p>
      </main>
    </div>
  );
};

export default DashboardPage;