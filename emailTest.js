const nodemailer = require('nodemailer');

// Transportador con los datos de Brevo (antes Sendinblue)
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com', // Servidor Brevo
  port: 587,                    // Puerto TLS
  secure: false,                // false porque usamos puerto 587 (TLS, no SSL)
  auth: {
    user: '8cb240001@smtp-brevo.com', // Tu usuario Brevo
    pass: 'dwJHA1h27KgZq9Pa'        // Tu clave SMTP generada
  }
});

// Definimos el correo que vamos a enviar
const mailOptions = {
  from: '"Veterinaria Amigo" <8cb240001@smtp-brevo.com>', // De quién viene
  to: 'cdherrera2005@gmail.com', // A quién quieres enviarle (puedes poner tu correo personal para probar)
  subject: '📢 Recordatorio de Cita - Veterinaria Amigo 🐾',
  text: 'Hola, este es un recordatorio de tu cita en Veterinaria Amigo para tu mascota. ¡Te esperamos pronto!'
};

// Enviar el correo
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error al enviar correo:', error);
  } else {
    console.log('Correo enviado exitosamente:', info.response);
  }
});
