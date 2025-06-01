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

// ✅ Eliminar un animal de un cliente
router.delete('/:id/animales/:animalId', async (req, res) => {
  try {
    const { id, animalId } = req.params;

    const cliente = await Cliente.findById(id);
    if (!cliente) {
      return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    cliente.animales = cliente.animales.filter(animal => animal._id.toString() !== animalId);
    await cliente.save();

    res.json({ mensaje: 'Animal eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando animal:', error);
    res.status(500).json({ mensaje: 'Error al eliminar animal', error });
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

    cita.deleteOne();
    await cliente.save();

    res.json({ mensaje: "Cita eliminada exitosamente" });
  } catch (error) {
    console.error('Error eliminando cita:', error);
    res.status(500).json({ mensaje: "Error al eliminar cita", error });
  }
});

router.get("/citas", async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener citas", error });
  }
});

// ✅ Ruta para modificar datos de un cliente
router.put('/:id', async (req, res) => {
  try {
    const clienteActualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!clienteActualizado) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    res.json({ mensaje: "Cliente actualizado correctamente", cliente: clienteActualizado });
  } catch (error) {
    console.error("Error actualizando cliente:", error);
    res.status(500).json({ mensaje: "Error al actualizar el cliente", error });
  }
});


// ✅ Ruta para modificar un animal
router.put('/:idCliente/animales/:idAnimal', async (req, res) => {
  try {
    const { idCliente, idAnimal } = req.params;

    const cliente = await Cliente.findById(idCliente);
    if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });

    const animal = cliente.animales.id(idAnimal);
    if (!animal) return res.status(404).json({ mensaje: 'Animal no encontrado' });

    // Actualizar campos
    animal.tipo = req.body.tipo;
    animal.nombre = req.body.nombre;
    animal.raza = req.body.raza;
    animal.edad = {
      anios: req.body.edad.anios || 0,
      meses: req.body.edad.meses || 0,
      dias: req.body.edad.dias || 0
    };
    animal.peso = req.body.peso;

    await cliente.save();

    res.json({ mensaje: 'Animal actualizado correctamente', animal });
  } catch (error) {
    console.error("❌ Error actualizando animal:", error);
    res.status(500).json({ mensaje: 'Error al actualizar el animal', error });
  }
});


module.exports = router;
