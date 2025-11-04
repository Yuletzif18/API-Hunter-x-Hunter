// Los modelos están disponibles globalmente desde app.js
const getPersonaje = () => global.Personaje;

exports.listarTodos = async (req, res) => {
  const Personaje = getPersonaje();
  const personajes = await Personaje.findAll();
  console.log('Contenido de la tabla personajes_hunterXhunter:', personajes);
  res.json(personajes);
};

exports.crear = async (req, res) => {
  const Personaje = getPersonaje();
  const personaje = await Personaje.create(req.body);
  res.status(201).json(personaje);
};

exports.modificar = async (req, res) => {
  const Personaje = getPersonaje();
  await Personaje.update(req.body, { where: { id: req.params.id } });
  const personaje = await Personaje.findByPk(req.params.id);
  res.json(personaje);
};

exports.eliminar = async (req, res) => {
  const Personaje = getPersonaje();
  await Personaje.destroy({ where: { id: req.params.id } });
  res.json({ mensaje: 'Personaje eliminado' });
};
