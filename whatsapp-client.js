const { Client, MessageMedia } = require("whatsapp-web.js");
const QRCode = require("qrcode");

let ultimoQR = ""; // QR en texto plano
let ultimoQRDataURL = ""; // QR en formato de imagen base64

const client = new Client();

client.on("qr", async (qr) => {
  ultimoQR = qr;
  try {
    ultimoQRDataURL = await QRCode.toDataURL(qr);
    console.log("📱 Escanea este código QR con tu WhatsApp:");
    console.log(qr); // QR como texto plano
  } catch (err) {
    console.error("❌ Error generando QR:", err);
  }
});

client.on("ready", () => {
  console.log("✅ Cliente de WhatsApp listo para enviar mensajes.");
});

client.initialize();

// Agregamos los métodos para obtener el QR
client.getUltimoQR = () => ultimoQR;
client.getUltimoQRDataURL = () => ultimoQRDataURL;

module.exports = client;
