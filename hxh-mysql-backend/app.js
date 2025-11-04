
require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');
const personajeRoutes = require('./routes/personajeRoutes');
const habilidadRoutes = require('./routes/habilidad/habilidadRoutes');


const cors = require('cors');
const { swaggerSpec, swaggerUi } = require('./swagger');

// Servidor único para personajes y habilidades
const app = express();
const sequelizePersonajes = new Sequelize(process.env.MYSQL_URI_PERSONAJES, {
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
const sequelizeHabilidades = new Sequelize(process.env.MYSQL_URI_HABILIDADES, {
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
const Personaje = require('./models/personaje')(sequelizePersonajes);
const Habilidad = require('./models/habilidad/habilidad')(sequelizeHabilidades);
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
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const PORT = process.env.PORT || 3002;

Promise.all([
  sequelizePersonajes.sync(),
  sequelizeHabilidades.sync()
]).then(() => {
  app.listen(PORT, () => console.log(`API de personajes y habilidades corriendo en puerto ${PORT}`));
});
