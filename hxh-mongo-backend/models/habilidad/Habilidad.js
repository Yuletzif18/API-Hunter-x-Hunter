const mongoose = require('mongoose');
const HabilidadSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: String,
  descripcion: String,
  personaje: String // nombre del personaje asociado
});
module.exports = { schema: HabilidadSchema };

