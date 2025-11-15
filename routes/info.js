const express = require('express');
const Usuario = require('../models/Usuario');

const router = express.Router();

// Endpoint público para comprobar estado del servidor y de la BD
router.get('/', async (req, res) => {
  try {
    const count = await Usuario.countDocuments();
    res.json({
      server: 'ok',
      db: 'connected',
      userCount: count
    });
  } catch (error) {
    res.status(500).json({ server: 'error', db: 'error', error: error.message });
  }
});

module.exports = router;
