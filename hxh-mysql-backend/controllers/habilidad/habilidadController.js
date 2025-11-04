// Los modelos están disponibles globalmente desde app.js
const getHabilidad = () => global.Habilidad;

exports.listarTodas = async (req, res) => {
  try {
    const Habilidad = getHabilidad();
    const habilidades = await Habilidad.findAll();
    console.log('Contenido de la tabla habilidades_hunterXhunter:', habilidades);
    res.json(habilidades);
  } catch (error) {
    console.error('Error al listar habilidades:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const Habilidad = getHabilidad();
    const habilidad = await Habilidad.create(req.body);
    res.status(201).json(habilidad);
  } catch (error) {
    console.error('Error al crear habilidad:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerPorPersonaje = async (req, res) => {
  try {
    const Habilidad = getHabilidad();
    const habilidades = await Habilidad.findAll({ 
      where: { personaje: req.params.nombre } 
    });
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
    const Habilidad = getHabilidad();
    const [updated] = await Habilidad.update(req.body, { 
      where: { personaje: req.params.nombre } 
    });
    if (updated === 0) {
      return res.status(404).json({ error: 'Habilidad no encontrada para este personaje' });
    }
    const habilidades = await Habilidad.findAll({ 
      where: { personaje: req.params.nombre } 
    });
    res.json(habilidades);
  } catch (error) {
    console.error('Error al modificar habilidad:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const Habilidad = getHabilidad();
    const deleted = await Habilidad.destroy({ 
      where: { personaje: req.params.nombre } 
    });
    if (deleted === 0) {
      return res.status(404).json({ error: 'No se encontraron habilidades para este personaje' });
    }
    res.json({ 
      mensaje: 'Habilidades eliminadas', 
      cantidad: deleted 
    });
  } catch (error) {
    console.error('Error al eliminar habilidades:', error);
    res.status(500).json({ error: error.message });
  }
};
