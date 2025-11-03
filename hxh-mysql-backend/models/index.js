
const Sequelize = require('sequelize');
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

const Personaje = require('./personaje')(sequelizePersonajes);
const Habilidad = require('./habilidad/habilidad')(sequelizeHabilidades);

module.exports = {
  sequelizePersonajes,
  sequelizeHabilidades,
  Personaje,
  Habilidad,
};
