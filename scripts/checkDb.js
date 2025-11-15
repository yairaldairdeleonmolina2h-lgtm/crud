require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI no definida en .env');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Conectado a MongoDB Atlas');

    const db = mongoose.connection.db;

    // Ping simple
    const ping = await db.command({ ping: 1 });
    console.log('Ping result:', ping);

    // Listar colecciones (limitado a 50)
    const cols = await db.listCollections().toArray();
    console.log('Colecciones encontradas:', cols.map(c => c.name));

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error conectando a MongoDB Atlas:', err.message || err);
    process.exit(1);
  }
})();
