// functions/index.js - VERSI 1 (Gratis)

const functions = require("firebase-functions");
const logger = require("firebase-functions/logger");
const cors = require("cors")({origin: true});

/**
 * Endpoint HTTP untuk menerima teks dan (nantinya) memanggil Gemini.
 * Bisa di-deploy di Spark Plan.
 */
exports.generatePresentationFromText = functions.https.onRequest(
    (request, response) => {
      // Menggunakan middleware CORS untuk mengizinkan request dari frontend
      cors(request, response, async () => {
        // Memastikan request adalah POST
        if (request.method !== "POST") {
          response.status(405).send("Method Not Allowed");
          return;
        }

        try {
          const text = request.body.text;
          if (!text || typeof text !== "string") {
            logger.error("Request body tidak valid", {body: request.body});
            response.status(400).send({error: "Request harus berisi 'text'."});
            return;
          }

          logger.info(`Menerima teks sepanjang ${text.length} karakter.`);

          // --- Di sinilah nanti kita akan memanggil Gemini API ---
          const result = `Teks sepanjang ${text.length} karakter diterima.`;
          // --------------------------------------------------------

          response.status(200).send({
            status: "success",
            message: result,
          });
        } catch (error) {
          logger.error("Terjadi kesalahan internal:", error);
          response.status(500).send({error: "Internal Server Error"});
        }
      });
    },
);
