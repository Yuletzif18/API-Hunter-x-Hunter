// Los modelos están disponibles globalmente desde app.js
const getHabilidad = () => global.Habilidad;

exports.listarTodas = async (req, res) => {
  const Habilidad = getHabilidad();
  const habilidades = await Habilidad.findAll();
  console.log('Contenido de la tabla habilidades_hunterXhunter:', habilidades);
  res.json(habilidades);
};

exports.crear = async (req, res) => {
  const Habilidad = getHabilidad();
  const habilidad = await Habilidad.create(req.body);
  res.status(201).json(habilidad);
};

exports.modificar = async (req, res) => {
  const Habilidad = getHabilidad();
  await Habilidad.update(req.body, { where: { id: req.params.id } });
  const habilidad = await Habilidad.findByPk(req.params.id);
  res.json(habilidad);
};

exports.eliminar = async (req, res) => {
  const Habilidad = getHabilidad();
  await Habilidad.destroy({ where: { id: req.params.id } });
  res.json({ mensaje: 'Habilidad eliminada' });
};
