// frontend/api/generate.js

export default async function handler(request, response) {
  // Hanya izinkan metode POST
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { text } = request.body;
    const geminiApiKey = process.env.GEMINI_API_KEY; // Ambil kunci dari Environment Variable

    // Validasi input
    if (!text) {
      return response.status(400).json({ error: "Request harus berisi 'text'." });
    }
    if (!geminiApiKey) {
      // Error ini akan muncul di log Vercel jika Anda lupa mengatur variabel
      throw new Error("GEMINI_API_KEY tidak diatur.");
    }

    // --- Di sinilah nanti kita akan memanggil Gemini API ---
    // Untuk sekarang, kita hanya akan mengembalikan pesan sukses sebagai konfirmasi
    const result = `(Vercel) Teks Anda sepanjang ${text.length} karakter diterima.`;
    // --------------------------------------------------------

    // Kirim respon sukses
    return response.status(200).json({ status: "success", message: result });

  } catch (error) {
    console.error("Error di Vercel Function:", error);
    return response.status(500).json({ error: "Terjadi kesalahan internal pada server." });
  }
}