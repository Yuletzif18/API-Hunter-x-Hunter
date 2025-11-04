
const Sequelize = require('sequelize');

// Configuración de conexión MySQL con fallback a DATABASE_URL
const dbConfig = {
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000
  },
  dialectOptions: {
    connectTimeout: 60000
  },
  retry: {
    max: 3
  }
};

const sequelizePersonajes = new Sequelize(process.env.MYSQL_URI_PERSONAJES || process.env.DATABASE_URL, dbConfig);
const sequelizeHabilidades = new Sequelize(process.env.MYSQL_URI_HABILIDADES || process.env.DATABASE_URL, dbConfig);

const Personaje = require('./personaje')(sequelizePersonajes);
const Habilidad = require('./habilidad/habilidad')(sequelizeHabilidades);

module.exports = {
  sequelizePersonajes,
  sequelizeHabilidades,
  Personaje,
  Habilidad,
};
