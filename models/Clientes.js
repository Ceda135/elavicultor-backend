const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  fecha: {
    type: String,
    required: true
  },
  hora: {
    type: String,
    required: true
  },
  correoEnviado: { // 👈 Nuevo campo agregado
    type: Boolean,
    default: false
  }
});

const animalSchema = new mongoose.Schema({
  tipo: String,
  nombre: String,
  raza: String,
  edad: {
    anios: { type: Number, required: true },
    meses: { type: Number },
    dias: { type: Number }
  },
  peso: Number,
  citas: [citaSchema]
});

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  cedula: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true
  },
  celular: {
    type: String,
    required: true
  },
  animales: [animalSchema]
});



module.exports = mongoose.model('Cliente', clienteSchema);
