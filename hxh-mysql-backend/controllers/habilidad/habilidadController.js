const db = require('../../models');
const Habilidad = db.Habilidad;

exports.listarTodas = async (req, res) => {
  const habilidades = await Habilidad.findAll();
  console.log('Contenido de la tabla habilidades_hunterXhunter:', habilidades);
  res.json(habilidades);
};

exports.crear = async (req, res) => {
  const habilidad = await Habilidad.create(req.body);
  res.status(201).json(habilidad);
};

exports.modificar = async (req, res) => {
  await Habilidad.update(req.body, { where: { id: req.params.id } });
  const habilidad = await Habilidad.findByPk(req.params.id);
  res.json(habilidad);
};

exports.eliminar = async (req, res) => {
  await Habilidad.destroy({ where: { id: req.params.id } });
  res.json({ mensaje: 'Habilidad eliminada' });
};
