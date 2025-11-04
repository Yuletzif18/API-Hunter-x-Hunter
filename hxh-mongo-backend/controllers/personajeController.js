exports.listarTodos = async (req, res) => {
  try {
    const Personaje = req.db.model('Personaje');
    const personajes = await Personaje.find();
    console.log('Personajes encontrados:', personajes.length);
    if (personajes.length === 0) {
      console.log('La colección Personajes_hunterXhunter está vacía o no se está leyendo correctamente.');
    }
    res.json(personajes);
  } catch (error) {
    console.error('Error al listar personajes:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const Personaje = req.db.model('Personaje');
    const personaje = new Personaje(req.body);
    await personaje.save();
    res.status(201).json(personaje);
  } catch (error) {
    console.error('Error al crear personaje:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerPorNombre = async (req, res) => {
  try {
    const Personaje = req.db.model('Personaje');
    const personaje = await Personaje.findOne({ nombre: req.params.nombre });
    if (!personaje) {
      return res.status(404).json({ error: 'Personaje no encontrado' });
    }
    res.json(personaje);
  } catch (error) {
    console.error('Error al obtener personaje:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.modificar = async (req, res) => {
  try {
    const Personaje = req.db.model('Personaje');
    const personaje = await Personaje.findOneAndUpdate(
      { nombre: req.params.nombre },
      req.body,
      { new: true }
    );
    if (!personaje) {
      return res.status(404).json({ error: 'Personaje no encontrado' });
    }
    res.json(personaje);
  } catch (error) {
    console.error('Error al modificar personaje:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const Personaje = req.db.model('Personaje');
    const personaje = await Personaje.findOneAndDelete({ nombre: req.params.nombre });
    if (!personaje) {
      return res.status(404).json({ error: 'Personaje no encontrado' });
    }
    res.json({ mensaje: 'Personaje eliminado' });
  } catch (error) {
    console.error('Error al eliminar personaje:', error);
    res.status(500).json({ error: error.message });
  }
};
