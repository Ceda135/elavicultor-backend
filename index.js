const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const nodemailer = require("nodemailer");
const cron = require("node-cron");
const fs = require("fs");
const clientesRoutes = require("./routes/clientes");
const Cliente = require("./models/Clientes");

require("dotenv").config();

const app = express();

// Middleware para recibir JSON
app.use(express.json());

// Hacer públicas las carpetas necesarias
app.use(express.static(path.join(__dirname, "public")));
app.use("/img", express.static(path.join(__dirname, "public/img")));

// Rutas
app.use("/clientes", clientesRoutes);

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Ruta para ver la hora del servidor
app.get("/hora-servidor", (req, res) => {
  const ahora = new Date();
  res.send(`La hora UTC actual del servidor es: ${ahora.toISOString()}`);
});

// Tarea programada
cron.schedule("* * * * *", async () => {

  console.log("⏰ Buscando citas para enviar recordatorios de mañana...");

  const hoy = new Date();
  const mañana = new Date(hoy);
  mañana.setDate(hoy.getDate() + 1);

  const yyyy = mañana.getFullYear();
  const mm = String(mañana.getMonth() + 1).padStart(2, '0');
  const dd = String(mañana.getDate()).padStart(2, '0');
  const fechaDeMañana = `${yyyy}-${mm}-${dd}`;


  console.log("🔎 Fecha de búsqueda:", fechaDeMañana);

  try {
    const clientes = await Cliente.find();

    for (const cliente of clientes) {
      for (const animal of cliente.animales) {
        for (const cita of animal.citas) {
          if (cita.fecha === fechaDeMañana && !cita.correoEnviado) {
            // Enviar correo
            const inicio = `${cita.fecha.replace(/-/g, "")}T${cita.hora.replace(":", "")}00`;
            const [hora, minutos] = cita.hora.split(":").map(Number);
            const finHora = hora + 1;
            const fin = `${cita.fecha.replace(/-/g, "")}T${finHora.toString().padStart(2, "0")}${minutos.toString().padStart(2, "0")}00`;
            const googleCalendarUrl = `https://calendar.google.com/calendar/r/eventedit?text=Cita%20en%20El%20Avicultor&dates=${inicio}/${fin}&details=Cita%20programada%20en%20El%20Avicultor&location=Av.%20Oswaldo%20Guayasam%C3%ADn%20S2-75%2C%20Quito%20170902`;

            const mailOptions = {
              from: '"El Avicultor" <elavicultor135@gmail.com>',
              to: cliente.correo,
              subject: "📢 Recordatorio de Cita",
              html: `
                <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333; line-height: 1.5;">
                  <div style="text-align: center;">
                    <img src="cid:logoEmpresa" alt="Logo" style="width: 200px; margin-bottom: 20px;">
                  </div>
                  <div>
                    <p>Hola <strong>${cliente.nombre}</strong>!!</p>
                    <p>Te recordamos que tiene una cita para <strong>${animal.nombre}</strong> a las <strong>${cita.hora}</strong> el dia de mañana en <strong>El Avicultor</strong>.</p>
                    <p>Para comunicarte con nosotros, contactanos mediante nuestras redes sociales</p>

                    <div style="margin-top: 20px;">
                      <a href="https://maps.app.goo.gl/ffkSAMoWKRtTiLAr8?g_st=aw"
                        style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                        Cómo llegar
                      </a>
                      &nbsp;
                      <a href="${googleCalendarUrl}"
                         style="padding: 10px 20px; background-color: #4285F4; color: white; text-decoration: none; border-radius: 5px;">
                        Agregar a Google Calendar
                      </a>
                    </div>

                    <hr style="margin-top: 30px; border: none; border-top: 1px solid #ccc;">
                    <footer style="font-size: 14px; margin-top: 10px;">
                      <p><strong>Dirección:</strong> Av. Oswaldo Guayasamín S2-75, Quito 170902</p>
                      <p><strong>Teléfono:</strong> 0963991023</p>
                      <p><strong>Más información:</strong> <a href="https://cheerful-zuccutto-aefd37.netlify.app">Sitio Web</a></p>
                    </footer>
                  </div>
                </div>
              `,

              attachments: [
                {
                  filename: "fondo-marca-agua.png",
                  path: path.join(__dirname, "public/img/fondo-marca-agua.png"),
                  cid: "logoEmpresa",
                },
              ],
            };

            await transporter.sendMail(mailOptions);
            console.log(`✅ Correo enviado a ${cliente.correo} para ${animal.nombre}`);


            // Marcar como enviado
            cita.correoEnviado = true;
            await cliente.save();
          }
        }
      }
    }
  } catch (error) {
    console.error("❌ Error enviando recordatorios:", error);
  }
});



// ===========================
// Conexión a la base de datos
// ===========================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error conectando a MongoDB", err));

// ===========================
// Iniciar servidor
// ===========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
