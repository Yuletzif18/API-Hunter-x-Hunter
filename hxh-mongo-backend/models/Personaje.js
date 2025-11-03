const mongoose = require('mongoose');
const PersonajeSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  edad: Number,
  altura: Number,
  peso: Number,
  urlImagen: { type: String, required: true },
  genero: String,
  descripcion: String,
  habilidad: String,
  origen: String
});
module.exports = { schema: PersonajeSchema };
