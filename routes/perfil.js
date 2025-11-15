const express = require('express');
const autenticar = require('../middleware/autenticar');
const Usuario = require('../models/Usuario');

const router = express.Router();

// Obtener perfil del usuario autenticado
router.get('/perfil', autenticar, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId).select('-contraseña');
    
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        createdAt: usuario.createdAt
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
  }
});

// Editar nombre del usuario
router.put('/editar-nombre', autenticar, async (req, res) => {
  try {
    const { nuevoNombre } = req.body;

    if (!nuevoNombre || nuevoNombre.trim() === '') {
      return res.status(400).json({ mensaje: 'El nombre no puede estar vacío' });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuarioId,
      { nombre: nuevoNombre.trim() },
      { new: true }
    ).select('-contraseña');

    res.json({
      mensaje: 'Nombre actualizado exitosamente',
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error('Error al editar nombre:', error);
    res.status(500).json({ mensaje: 'Error al editar nombre', error: error.message });
  }
});

// Eliminar cuenta del usuario
router.delete('/eliminar-cuenta', autenticar, async (req, res) => {
  try {
    const { contraseña } = req.body;

    if (!contraseña) {
      return res.status(400).json({ mensaje: 'Contraseña requerida para eliminar la cuenta' });
    }

    // Verificar la contraseña
    const usuario = await Usuario.findById(req.usuarioId);
    const contraseñaValida = await usuario.compararContraseña(contraseña);

    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Eliminar usuario
    await Usuario.findByIdAndDelete(req.usuarioId);

    res.json({ mensaje: 'Cuenta eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar cuenta:', error);
    res.status(500).json({ mensaje: 'Error al eliminar cuenta', error: error.message });
  }
});

module.exports = router;
