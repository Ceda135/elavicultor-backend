const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const nodemailer = require("nodemailer"); // 👈 Agregado para correos
const clientesRoutes = require("./routes/clientes");
require("dotenv").config();

const app = express();

// Middleware para recibir JSON
app.use(express.json());

// Hacer pública la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Hacer pública la carpeta "img"
app.use("/img", express.static(path.join(__dirname, "public/img")));

// Usar las rutas de clientes
app.use("/clientes", clientesRoutes);

// 🔵 Configurar transporter de nodemailer (Brevo SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // Servidor SMTP de Brevo
  port: 587,
  secure: false, // TLS (no SSL)
  auth: {
    user: "8cb240001@smtp-brevo.com", // <-- Tu usuario SMTP Brevo
    pass: "dwJHA1h27KgZq9Pa", // <-- Tu contraseña SMTP (ponla aquí)
  },
});

// 🔵 Nueva ruta para enviar correo manualmente
app.get("/enviar-correo", (req, res) => {
  const mailOptions = {
    from: '"Veterinaria Amigo" <8cb240001@smtp-brevo.com>',
    to: "cdherrera2005@gmail.com", // <-- Cambia por tu correo personal para pruebas
    subject: "📢 Recordatorio de Cita - Veterinaria Amigo 🐾",
    text: "Hola, este es un recordatorio de tu cita en Veterinaria Amigo para tu mascota. ¡Te esperamos pronto!",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error al enviar correo:", error);
      return res.status(500).send("Error enviando el correo");
    } else {
      console.log("✅ Correo enviado exitosamente:", info.response);
      return res.send("Correo enviado exitosamente");
    }
  });
});

// Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error conectando a MongoDB", err));

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
