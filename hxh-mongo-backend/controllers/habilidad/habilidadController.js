exports.listarTodas = async (req, res) => {
  try {
    const Habilidad = req.db.model('Habilidad');
    const habilidades = await Habilidad.find();
    console.log('Habilidades encontradas:', habilidades.length);
    if (habilidades.length === 0) {
      console.log('La colección Habilidades_hunterXhunter está vacía o no se está leyendo correctamente.');
    }
    res.json(habilidades);
  } catch (error) {
    console.error('Error al listar habilidades:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const Habilidad = req.db.model('Habilidad');
    const habilidad = new Habilidad(req.body);
    await habilidad.save();
    res.status(201).json(habilidad);
  } catch (error) {
    console.error('Error al crear habilidad:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.modificar = async (req, res) => {
  try {
    const Habilidad = req.db.model('Habilidad');
    const habilidad = await Habilidad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!habilidad) {
      return res.status(404).json({ error: 'Habilidad no encontrada' });
    }
    res.json(habilidad);
  } catch (error) {
    console.error('Error al modificar habilidad:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const Habilidad = req.db.model('Habilidad');
    const habilidad = await Habilidad.findByIdAndDelete(req.params.id);
    if (!habilidad) {
      return res.status(404).json({ error: 'Habilidad no encontrada' });
    }
    res.json({ mensaje: 'Habilidad eliminada' });
  } catch (error) {
    console.error('Error al eliminar habilidad:', error);
    res.status(500).json({ error: error.message });
  }
};
