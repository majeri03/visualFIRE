export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { text } = request.body;
    // Kita akan butuh API Key Hugging Face, tapi ini gratis didapat
    const huggingFaceApiKey = process.env.HUGGING_FACE_API_KEY; 

    if (!text) {
      return response.status(400).json({ error: "Request harus berisi 'text'." });
    }
    if (!huggingFaceApiKey) {
      throw new Error("HUGGING_FACE_API_KEY tidak diatur di environment variables Vercel.");
    }
    
    const prompt = `
      Anda adalah seorang Expert Infographic Developer yang menghasilkan kode HTML, CSS, dan JavaScript untuk infografis yang modern dan interaktif.

      TUGAS:
      Buat SATU file HTML lengkap yang mengubah teks di bawah ini menjadi sebuah infografis visual yang menawan dan sepenuhnya responsif.

      STRUKTUR WAJIB:
      - HTML: Gunakan HTML5 semantik. Sertakan meta tags yang relevan (charset, viewport, title). Judul <title> harus relevan dengan konten teks.
      - CSS: Semua styling WAJIB berada di dalam tag <style> di dalam <head>. Gunakan CSS Grid atau Flexbox untuk layout. Pilih palet warna profesional yang sesuai dengan konteks teks. Impor dan gunakan Google Fonts seperti 'Inter' atau 'Poppins'.
      - JavaScript: Semua script WAJIB berada di dalam tag <script> sebelum penutup </body>. Implementasikan animasi reveal-on-scroll menggunakan Intersection Observer API untuk membuat elemen muncul secara elegan saat digulir.

      VISUALISASI DATA:
      - Data Kualitatif (Konsep, ide): Representasikan menggunakan komponen 'kartu' (div dengan border, box-shadow, dan padding).
      - Data Kuantitatif (Angka, persentase): Gunakan progress bar atau bar chart yang dianimasikan menggunakan CSS keyframes.
      - ATURAN KETAT: JANGAN PERNAH MENCIPTAKAN ANGKA ATAU PERSENTASE SENDIRI. Jika tidak ada data numerik eksplisit di dalam teks sumber, jangan buat visualisasi numerik. Cukup gunakan kartu untuk semua poin.

      GAMBAR:
      - Integrasikan gambar yang relevan secara kontekstual dari Unsplash. Gunakan format URL: https://source.unsplash.com/800x600/?[keyword] di mana [keyword] adalah kata kunci relevan yang Anda ekstrak dari teks (misalnya: 'technology', 'environment'). Gunakan atribut loading="lazy" pada tag <img>.

      KUALITAS STANDAR:
      - Desain harus mobile-first.
      - Hirarki visual harus jelas (judul besar, subjudul, teks).
      - Wajib accessible (gunakan alt text untuk gambar).

      OUTPUT:
      Berikan HANYA kode HTML lengkap. File harus mandiri (self-contained) dan siap dibuka di browser. Jangan sertakan penjelasan apa pun di luar kode.

      Teks untuk dianalisis:
      ---
      ${text}
      ---
    `;

    // Panggil API Hugging Face
    const apiResponse = await fetch(
        "https://api-inference.huggingface.co/models/openai-community/gpt2",
        {
            headers: { Authorization: `Bearer ${huggingFaceApiKey}` },
            method: "POST",
            body: JSON.stringify({ inputs: prompt }),
        }
    );

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        console.error("Hugging Face API Error:", errorBody);
        throw new Error("Gagal mendapatkan respons dari Hugging Face API.");
    }

    const result = await apiResponse.json();
    // Ekstrak teks yang dihasilkan oleh model
    const generatedHtml = result[0].generated_text.replace(prompt, '').trim();

    return response.status(200).json({ 
      status: "success", 
      htmlContent: generatedHtml // Kirim HTML yang dihasilkan
    });

  } catch (error) {
    console.error("Error di Vercel Function:", error.message);
    return response.status(500).json({ error: "Terjadi kesalahan saat membuat infografis." });
  }
}