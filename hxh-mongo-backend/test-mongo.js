require('dotenv').config();
const mongoose = require('mongoose');

console.log('Probando conexión a MongoDB Atlas...');
console.log('URI Personajes:', process.env.MONGODB_URI_PERSONAJES ? '✓ Definida' : '✗ No definida');
console.log('URI Habilidades:', process.env.MONGODB_URI_HABILIDADES ? '✓ Definida' : '✗ No definida');

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI_PERSONAJES);
    console.log('✓ Conexión exitosa a MongoDB Atlas - Personajes');
    
    // Intentar listar colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Colecciones disponibles:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('✓ Prueba completada exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error de conexión:', error.message);
    process.exit(1);
  }
}

testConnection();
