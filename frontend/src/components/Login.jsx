// src/components/Login.jsx

import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Button } from '@/components/ui/button'; // <-- 1. Impor Button baru

const Login = () => {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Login berhasil:', result.user);
    } catch (error) {
      console.error('Error saat login dengan Google:', error);
    }
  };

  return (
    // Menggunakan flexbox dari Tailwind untuk memusatkan konten
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <div className="p-8 bg-white shadow-md rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-2">Selamat Datang di F.I.R.E.</h2>
        <p className="text-slate-600 mb-6">Silakan login untuk memulai</p>
        {/* 2. Gunakan komponen Button baru */}
        <Button onClick={handleGoogleSignIn} size="lg">
          Login dengan Google
        </Button>
      </div>
    </div>
  );
};

export default Login;