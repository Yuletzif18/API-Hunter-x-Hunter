const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  return sequelize.define('Habilidad', {
    nombre: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
    tipo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    personaje: { type: DataTypes.STRING, allowNull: false } // nombre del personaje asociado
  }, {
    tableName: 'habilidades_hunterxhunter',
    timestamps: false
  });
};
