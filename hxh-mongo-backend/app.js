const cors = require('cors');
// Swagger UI
const swaggerSetup = require('./swagger');

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const personajeRoutes = require('./routes/personajeRoutes');
const habilidadRoutes = require('./routes/habilidad/habilidadRoutes');

// Validar variables de entorno
if (!process.env.MONGODB_URI_PERSONAJES || !process.env.MONGODB_URI_HABILIDADES) {
  console.error('❌ Error: Variables de entorno MONGODB_URI_PERSONAJES y MONGODB_URI_HABILIDADES son requeridas');
  console.log('Variables actuales:');
  console.log('- MONGODB_URI_PERSONAJES:', process.env.MONGODB_URI_PERSONAJES ? '✓ Definida' : '✗ No definida');
  console.log('- MONGODB_URI_HABILIDADES:', process.env.MONGODB_URI_HABILIDADES ? '✓ Definida' : '✗ No definida');
  process.exit(1);
}

// URIs para cada base de datos desde variables de entorno
const uriPersonajes = process.env.MONGODB_URI_PERSONAJES;
const uriHabilidades = process.env.MONGODB_URI_HABILIDADES;

console.log('🔧 Configurando conexiones a MongoDB Atlas...');

// Conexiones separadas con manejo de eventos
const connPersonajes = mongoose.createConnection(uriPersonajes);
const connHabilidades = mongoose.createConnection(uriHabilidades);

connPersonajes.on('connected', () => {
  console.log('Conexión exitosa a la base Personajes_hunterXhunter');
});
connPersonajes.on('error', (err) => {
  console.error('Error de conexión en Personajes_hunterXhunter:', err);
});
connHabilidades.on('connected', () => {
  console.log('Conexión exitosa a la base Habilidades_hunterXhunter');
});
connHabilidades.on('error', (err) => {
  console.error('Error de conexión en Habilidades_hunterXhunter:', err);
});

// Registrar modelos con sus colecciones y log de registro
const PersonajeSchema = require('./models/Personaje').schema;
connPersonajes.model('Personaje', PersonajeSchema, 'personajes');
console.log('Modelo Personaje registrado en colección "personajes" de la base Personajes_hunterXhunter');

const HabilidadSchema = require('./models/habilidad/Habilidad').schema;
connHabilidades.model('Habilidad', HabilidadSchema, 'habilidades');
console.log('Modelo Habilidad registrado en colección "habilidades" de la base Habilidades_hunterXhunter');

// Unificar servidor para Render
const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'hxh-mongo-backend',
    mongodb: {
      personajes: connPersonajes.readyState === 1 ? 'connected' : 'disconnected',
      habilidades: connHabilidades.readyState === 1 ? 'connected' : 'disconnected'
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'API Hunter x Hunter - MongoDB Backend',
    endpoints: {
      personajes: '/api/personajes',
      habilidades: '/api/habilidades',
      docs: '/docs',
      health: '/health'
    }
  });
});

// Middleware para seleccionar la conexión según el endpoint
app.use((req, res, next) => {
  if (req.path.startsWith('/api/personajes')) {
    req.db = connPersonajes;
  } else if (req.path.startsWith('/api/habilidades')) {
    req.db = connHabilidades;
  }
  next();
});

app.use('/api/personajes', personajeRoutes);
app.use('/api/habilidades', habilidadRoutes);
swaggerSetup(app);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`API Hunter x Hunter escuchando en puerto ${PORT}`);
  console.log(`Documentación Swagger disponible en http://localhost:${PORT}/docs`);
});
