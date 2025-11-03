
const Sequelize = require('sequelize');
const sequelizePersonajes = new Sequelize(process.env.MYSQL_URI_PERSONAJES);
const sequelizeHabilidades = new Sequelize(process.env.MYSQL_URI_HABILIDADES);

const Personaje = require('./personaje')(sequelizePersonajes);
const Habilidad = require('./habilidad/habilidad')(sequelizeHabilidades);

module.exports = {
  sequelizePersonajes,
  sequelizeHabilidades,
  Personaje,
  Habilidad,
};
