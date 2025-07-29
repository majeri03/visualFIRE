// src/pages/DashboardPage.jsx

import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Wand2 } from 'lucide-react';

const DashboardPage = ({ user }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleGeneratePresentation = async () => {
    if (!inputText.trim()) {
      toast.error("Tolong masukkan teks terlebih dahulu.");
      return;
    }
    setIsLoading(true);

    try {
      // Cukup panggil path relatif ini. Vercel akan otomatis mengarahkannya.
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Menangani error dari server dengan lebih baik
        throw new Error(responseData.error || 'Terjadi kesalahan pada server.');
      }

      console.log("Respon dari Vercel:", responseData);
      toast.success(`Sukses! Backend merespon: "${responseData.message}"`);

    } catch (error) {
      console.error("Error memanggil Vercel function:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="flex justify-between items-center p-4 border-b bg-white">
        <h1 className="text-xl font-bold">F.I.R.E. Dashboard</h1>
        <div className='flex items-center gap-4'>
          <p className="text-sm text-slate-600 hidden sm:block">{user.email}</p>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <main className="p-4 sm:p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Mulai Proyek Baru</CardTitle>
            <CardDescription>
              Tempelkan teks mentah, data, atau draf laporan Anda di bawah ini. AI kami akan menganalisis dan mengubahnya menjadi draf presentasi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ketik atau tempelkan teks Anda di sini..."
              className="min-h-[300px] text-base"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
          </CardContent>
          <CardFooter>
            <Button size="lg" onClick={handleGeneratePresentation} disabled={isLoading}>
              {isLoading ? (
                'Menganalisis...'
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Hasilkan Presentasi
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default DashboardPage;