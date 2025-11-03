const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Habilidad', {
    nombre: { type: DataTypes.STRING, allowNull: false },
    tipo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    personaje: { type: DataTypes.STRING, allowNull: false } // nombre del personaje asociado
  }, {
    tableName: 'habilidades_hunterXhunter',
    timestamps: false
  });
};
