// src/pages/DashboardPage.jsx - VERSI INFOGRAFIS

import React, { useState, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Wand2, Sparkles, Download, FileText } from 'lucide-react';
import html2canvas from 'html2canvas';

const DashboardPage = ({ user }) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [infographicHtml, setInfographicHtml] = useState('');
  const iframeRef = useRef(null);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Anda berhasil logout.");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Gagal untuk logout.");
    }
  };

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      toast.error("Tolong masukkan teks terlebih dahulu.");
      return;
    }
    setIsLoading(true);
    setInfographicHtml('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || 'Terjadi kesalahan pada server.');
      }

      setInfographicHtml(responseData.htmlContent);
      toast.success("Infografis berhasil dibuat!");

    } catch (error) {
      console.error("Error memanggil Vercel function:", error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([infographicHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'infografis.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const iframeBody = iframeRef.current.contentWindow.document.body;
      if (iframeBody) {
        toast.info("Sedang mempersiapkan gambar PNG...");
        html2canvas(iframeBody, {
          useCORS: true, // Izinkan memuat gambar dari domain lain (seperti Unsplash)
          scale: 2,      // Tingkatkan resolusi gambar 2x lipat
        }).then(canvas => {
          const image = canvas.toDataURL('image/png');
          const a = document.createElement('a');
          a.href = image;
          a.download = 'infografis-fire.png';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          toast.success("Gambar PNG berhasil diunduh!");
        }).catch(err => {
          console.error("Gagal membuat PNG:", err);
          toast.error("Gagal membuat gambar PNG.");
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="flex justify-between items-center p-4 border-b bg-white dark:bg-slate-800 dark:border-slate-700">
        <h1 className="text-xl font-bold">F.I.R.E. Dashboard</h1>
        <div className='flex items-center gap-4'>
          <p className="text-sm text-slate-600 dark:text-slate-300 hidden sm:block">{user.email}</p>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="p-4 sm:p-8 grid gap-8">
        <Card className="max-w-4xl mx-auto w-full">
          <CardHeader>
            <CardTitle className="text-2xl">Mulai Proyek Baru</CardTitle>
            <CardDescription>
              Tempelkan teks mentah Anda di bawah ini. AI akan membuatkan infografis HTML interaktif untuk Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Ketik atau tempelkan teks Anda di sini..."
              className="min-h-[250px] text-base"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isLoading}
            />
          </CardContent>
          <CardFooter>
            <Button size="lg" onClick={handleGenerate} disabled={isLoading}>
              {isLoading ? ('Membuat Infografis...') : (
                <><Wand2 className="mr-2 h-5 w-5" />Hasilkan Infografis</>
              )}
            </Button>
          </CardFooter>
        </Card>

        {infographicHtml && (
          <Card className="max-w-4xl mx-auto w-full animate-in fade-in-50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-yellow-500" />
                  <CardTitle>Pratinjau Infografis</CardTitle>
                </div>
                <div className="flex gap-2">
                   <Button variant="outline" onClick={handleDownloadHtml}>
                     <Download className="mr-2 h-4 w-4" /> Download HTML
                   </Button>
                    <Button variant="outline" onClick={handleDownloadPng}>
                     <ImageIcon className="mr-2 h-4 w-4" /> Download PNG
                   </Button>
                   <Button variant="outline" disabled>
                     <FileText className="mr-2 h-4 w-4" /> Download PPTX (Segera)
                   </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="border-t pt-4">
              <iframe
              ref={iframeRef}
                srcDoc={infographicHtml}
                title="Pratinjau Infografis"
                className="w-full h-[600px] border rounded-md"
                sandbox="allow-scripts"
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;