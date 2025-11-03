exports.listarTodas = async (req, res) => {
  const Habilidad = req.db.model('Habilidad');
  const habilidades = await Habilidad.find();
  console.log('Habilidades encontradas:', habilidades.length);
  if (habilidades.length === 0) {
    console.log('La colección Habilidades_hunterXhunter está vacía o no se está leyendo correctamente.');
  }
  res.json(habilidades);
};

exports.crear = async (req, res) => {
  const Habilidad = req.db.model('Habilidad');
  const habilidad = new Habilidad(req.body);
  await habilidad.save();
  res.status(201).json(habilidad);
};

exports.modificar = async (req, res) => {
  const Habilidad = req.db.model('Habilidad');
  const habilidad = await Habilidad.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(habilidad);
};

exports.eliminar = async (req, res) => {
  const Habilidad = req.db.model('Habilidad');
  await Habilidad.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Habilidad eliminada' });
};
