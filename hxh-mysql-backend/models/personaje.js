const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Personaje', {
    nombre: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    edad: DataTypes.INTEGER,
    altura: DataTypes.INTEGER,
    peso: DataTypes.INTEGER,
    urlImagen: { type: DataTypes.STRING, allowNull: false },
    genero: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    habilidad: DataTypes.STRING,
    origen: DataTypes.STRING
  }, {
    tableName: 'personajes_hunterXhunter',
    timestamps: false
  });
};
