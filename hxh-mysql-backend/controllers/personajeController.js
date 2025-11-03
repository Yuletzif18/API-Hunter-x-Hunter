const db = require('../models');
const Personaje = db.Personaje;

exports.listarTodos = async (req, res) => {
  const personajes = await Personaje.findAll();
  console.log('Contenido de la tabla personajes_hunterXhunter:', personajes);
  res.json(personajes);
};

exports.crear = async (req, res) => {
  const personaje = await Personaje.create(req.body);
  res.status(201).json(personaje);
};

exports.modificar = async (req, res) => {
  await Personaje.update(req.body, { where: { id: req.params.id } });
  const personaje = await Personaje.findByPk(req.params.id);
  res.json(personaje);
};

exports.eliminar = async (req, res) => {
  await Personaje.destroy({ where: { id: req.params.id } });
  res.json({ mensaje: 'Personaje eliminado' });
};
