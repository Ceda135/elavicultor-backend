const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  fecha: {
    type: String,
    required: true
  },
  hora: {
    type: String,
    required: true
  }
});

const animalSchema = new mongoose.Schema({
  tipo: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  raza: {
    type: String,
    required: true
  },
  edad: {
    type: Number,
    required: true
  },
  peso: {
    type: Number
  },
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
