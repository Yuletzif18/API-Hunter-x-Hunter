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

exports.obtenerPorPersonaje = async (req, res) => {
  try {
    const Habilidad = req.db.model('Habilidad');
    const habilidades = await Habilidad.find({ personaje: req.params.nombre });
    if (habilidades.length === 0) {
      return res.status(404).json({ error: 'No se encontraron habilidades para este personaje' });
    }
    res.json(habilidades);
  } catch (error) {
    console.error('Error al obtener habilidades:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.modificar = async (req, res) => {
  try {
    const Habilidad = req.db.model('Habilidad');
    const result = await Habilidad.updateMany(
      { personaje: req.params.nombre },
      req.body
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Habilidad no encontrada para este personaje' });
    }
    const habilidades = await Habilidad.find({ personaje: req.params.nombre });
    res.json(habilidades);
  } catch (error) {
    console.error('Error al modificar habilidad:', error);
    res.status(500).json({ error: error.message });
  }
};

// Modificar una habilidad específica por nombre y personaje
exports.modificarHabilidadEspecifica = async (req, res) => {
  try {
    const Habilidad = req.db.model('Habilidad');
    const { nombreHabilidad, nombrePersonaje } = req.params;
    
    const habilidad = await Habilidad.findOneAndUpdate(
      { nombre: nombreHabilidad, personaje: nombrePersonaje },
      req.body,
      { new: true, runValidators: true }
    );
    
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
    const result = await Habilidad.deleteMany({ personaje: req.params.nombre });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'No se encontraron habilidades para este personaje' });
    }
    res.json({ 
      mensaje: 'Habilidades eliminadas', 
      cantidad: result.deletedCount 
    });
  } catch (error) {
    console.error('Error al eliminar habilidad:', error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una habilidad específica por nombre y personaje
exports.eliminarHabilidadEspecifica = async (req, res) => {
  try {
    const Habilidad = req.db.model('Habilidad');
    const { nombreHabilidad, nombrePersonaje } = req.params;
    
    const habilidad = await Habilidad.findOneAndDelete({
      nombre: nombreHabilidad,
      personaje: nombrePersonaje
    });
    
    if (!habilidad) {
      return res.status(404).json({ error: 'Habilidad no encontrada' });
    }
    
    res.json({ 
      mensaje: 'Habilidad eliminada',
      habilidad
    });
  } catch (error) {
    console.error('Error al eliminar habilidad:', error);
    res.status(500).json({ error: error.message });
  }
};
