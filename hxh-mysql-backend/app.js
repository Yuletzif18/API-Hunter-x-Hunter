
require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const personajeRoutes = require('./routes/personajeRoutes');
const habilidadRoutes = require('./routes/habilidad/habilidadRoutes');


const cors = require('cors');
const swaggerSetup = require('./swagger');

// Servidor único para personajes y habilidades
const app = express();

// Configuración de conexión MySQL con timeout aumentado y retry
const dbConfig = {
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 60000, // Aumentado a 60 segundos
    idle: 10000
  },
  dialectOptions: {
    connectTimeout: 60000 // Timeout de 60 segundos
  },
  retry: {
    max: 3 // Reintentar 3 veces
  }
};

const sequelizePersonajes = new Sequelize(process.env.MYSQL_URI_PERSONAJES || process.env.DATABASE_URL, dbConfig);
const sequelizeHabilidades = new Sequelize(process.env.MYSQL_URI_HABILIDADES || process.env.DATABASE_URL, dbConfig);
const Personaje = require('./models/personaje')(sequelizePersonajes);
const Habilidad = require('./models/habilidad/habilidad')(sequelizeHabilidades);

// Hacer los modelos disponibles globalmente para los controladores
global.Personaje = Personaje;
global.Habilidad = Habilidad;

app.use(cors());
app.use(express.json());

// Healthcheck endpoint para Railway
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'hxh-mysql-backend'
  });
});

app.use('/api/personajes', personajeRoutes);
app.use('/api/habilidades', habilidadRoutes);

// Configurar Swagger UI
swaggerSetup(app);

const PORT = process.env.PORT || 3002;

// Función para iniciar el servidor con manejo de errores mejorado
async function startServer() {
  try {
    console.log('Intentando conectar a las bases de datos...');
    await Promise.all([
      sequelizePersonajes.authenticate(),
      sequelizeHabilidades.authenticate()
    ]);
    console.log('✓ Conexiones a bases de datos establecidas correctamente');
    
    await Promise.all([
      sequelizePersonajes.sync(),
      sequelizeHabilidades.sync()
    ]);
    console.log('✓ Modelos sincronizados correctamente');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ API de personajes y habilidades corriendo en puerto ${PORT}`);
      console.log(`✓ Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('✗ Error al iniciar el servidor:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  }
}

startServer();
