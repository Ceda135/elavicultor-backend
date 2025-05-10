const express = require('express');
const router = express.Router();
const Cliente = require('../models/Clientes');

// ✅ Registrar un nuevo cliente
router.post('/', async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    await nuevoCliente.save();
    res.json({ mensaje: "Cliente registrado con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar cliente", error });
  }
});

// ✅ Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener clientes", error });
  }
});

// ✅ Obtener un cliente específico por ID
router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener cliente", error });
  }
});

// ✅ Eliminar un cliente
router.delete('/:id', async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Cliente eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar cliente", error });
  }
});

// ✅ Agregar un animal a un cliente
router.post('/:id/animales', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    cliente.animales.push(req.body);
    await cliente.save();

    res.json({ mensaje: "Animal registrado exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar animal", error });
  }
});

// ✅ Agendar una cita para un animal de un cliente
router.post('/:id/animales/:animalId/citas', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    const animal = cliente.animales.id(req.params.animalId);
    if (!animal) {
      return res.status(404).json({ mensaje: "Animal no encontrado" });
    }

    animal.citas.push(req.body);
    await cliente.save();

    res.json({ mensaje: "Cita registrada exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar cita", error });
  }
});

// ✅ Eliminar una cita de un animal
router.delete('/:id/animales/:animalId/citas/:citaId', async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    const animal = cliente.animales.id(req.params.animalId);
    if (!animal) {
      return res.status(404).json({ mensaje: "Animal no encontrado" });
    }

    const cita = animal.citas.id(req.params.citaId);
    if (!cita) {
      return res.status(404).json({ mensaje: "Cita no encontrada" });
    }

    cita.remove();
    await cliente.save();

    res.json({ mensaje: "Cita eliminada exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar cita", error });
  }
});

module.exports = router;
