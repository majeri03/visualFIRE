// src/App.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import AuthPage from './pages/AuthPage'; // Halaman baru untuk login/register
import DashboardPage from './pages/DashboardPage'; // Halaman baru untuk dasbor
import { Toaster } from "@/components/ui/sonner";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listener ini akan berjalan setiap kali status auth berubah (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup listener saat komponen tidak lagi digunakan
    return () => unsubscribe();
  }, []);

  // Tampilkan loading screen saat status auth sedang diperiksa
  if (loading) {
    return <div>Loading...</div>; // Nanti kita buat ini lebih keren
  }

  // Jika ada user, tampilkan dasbor. Jika tidak, tampilkan halaman auth.
  return (
    <> {/* <-- Gunakan Fragment agar bisa menampung Toaster */}
      {user ? <DashboardPage user={user} /> : <AuthPage />}
      <Toaster richColors /> {/* <-- 2. Tambahkan Toaster di sini */}
    </>
  );
}

export default App;