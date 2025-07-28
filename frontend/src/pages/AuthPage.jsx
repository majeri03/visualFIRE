// src/pages/AuthPage.jsx - VERSI LENGKAP DENGAN SEMUA PERBAIKAN

import React, { useState } from 'react';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { toast } from "sonner"; // <-- Impor toast untuk notifikasi

// Komponen UI dari Shadcn
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn } from 'lucide-react';

// Fungsi untuk menerjemahkan error Firebase ke pesan yang lebih ramah
const getFriendlyErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/weak-password':
      return 'Password harus terdiri dari minimal 6 karakter.';
    case 'auth/email-already-in-use':
      return 'Email ini sudah terdaftar. Silakan masuk.';
    case 'auth/invalid-email':
      return 'Format email tidak valid.';
    case 'auth/invalid-credential':
      return 'Email atau password yang Anda masukkan salah.';
    default:
      return 'Terjadi kesalahan. Silakan coba lagi.';
  }
};

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthAction = async (action) => {
    setIsLoading(true);
    try {
      await action();
      // onAuthStateChanged akan menangani redirect, tidak perlu toast sukses di sini
    } catch (error) {
      console.error('Auth Error:', error.code, error.message);
      toast.error(getFriendlyErrorMessage(error.code));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => handleAuthAction(() => signInWithPopup(auth, googleProvider));
  const handleRegister = () => handleAuthAction(() => createUserWithEmailAndPassword(auth, email, password));
  const handleLogin = () => handleAuthAction(() => signInWithEmailAndPassword(auth, email, password));

  // Menambahkan efek transisi dan interaksi
  const buttonClasses = "w-full transition-transform active:scale-95";
  const inputClasses = "transition-colors focus:border-primary hover:border-slate-400";
  const tabsContentClasses = "transition-all duration-300";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Tabs defaultValue="login" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Masuk</TabsTrigger>
          <TabsTrigger value="register">Daftar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login" className={tabsContentClasses}>
          <Card>
            <CardHeader>
              <CardTitle>Masuk ke F.I.R.E.</CardTitle>
              <CardDescription>Masukkan detail akun Anda untuk melanjutkan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} disabled={isLoading} />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button className={buttonClasses} onClick={handleLogin} disabled={isLoading}>
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Button>
              <Button variant="outline" className={buttonClasses} onClick={handleGoogleSignIn} disabled={isLoading}>
                <LogIn className="mr-2 h-4 w-4" /> Masuk dengan Google
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="register" className={tabsContentClasses}>
          <Card>
            <CardHeader>
              <CardTitle>Buat Akun Baru</CardTitle>
              <CardDescription>Daftarkan akun Anda dengan email dan password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input id="register-email" type="email" placeholder="nama@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} disabled={isLoading} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} disabled={isLoading} />
              </div>
            </CardContent>
            <CardFooter>
              <Button className={buttonClasses} onClick={handleRegister} disabled={isLoading}>
                {isLoading ? 'Memproses...' : 'Daftar'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;