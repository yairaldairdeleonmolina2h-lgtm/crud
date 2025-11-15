const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

// Conectar a la base de datos
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuario', require('./routes/perfil'));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ mensaje: '✅ Servidor funcionando correctamente' });
});

// Puerto
const PORT = process.env.PORT || 5000;

// Arrancar servidor y manejar errores de binding (EADDRINUSE, EACCES, etc.)
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`❌ El puerto ${PORT} ya está en uso. Mata el proceso que lo usa o cambia PORT en .env.`);
  } else {
    console.error('❌ Error en el servidor:', err);
  }
  process.exit(1);
});

// Capturar promesas rechazadas no manejadas y excepciones no capturadas
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Cerrar servidor de forma ordenada
  if (server && server.close) server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  if (server && server.close) server.close(() => process.exit(1));
});
