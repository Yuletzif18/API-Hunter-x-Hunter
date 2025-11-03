exports.listarTodos = async (req, res) => {
  const Personaje = req.db.model('Personaje');
  const personajes = await Personaje.find();
  console.log('Personajes encontrados:', personajes.length);
  if (personajes.length === 0) {
    console.log('La colección Personajes_hunterXhunter está vacía o no se está leyendo correctamente.');
  }
  res.json(personajes);
};

exports.crear = async (req, res) => {
  const Personaje = req.db.model('Personaje');
  const personaje = new Personaje(req.body);
  await personaje.save();
  res.status(201).json(personaje);
};

exports.modificar = async (req, res) => {
  const Personaje = req.db.model('Personaje');
  const personaje = await Personaje.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(personaje);
};

exports.eliminar = async (req, res) => {
  const Personaje = req.db.model('Personaje');
  await Personaje.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Personaje eliminado' });
};
