// Los modelos están disponibles globalmente desde app.js
const getPersonaje = () => global.Personaje;

exports.listarTodos = async (req, res) => {
  try {
    const Personaje = getPersonaje();
    const personajes = await Personaje.findAll();
    console.log('Contenido de la tabla personajes_hunterXhunter:', personajes);
    res.json(personajes);
  } catch (error) {
    console.error('Error al listar personajes:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.crear = async (req, res) => {
  try {
    const Personaje = getPersonaje();
    const personaje = await Personaje.create(req.body);
    res.status(201).json(personaje);
  } catch (error) {
    console.error('Error al crear personaje:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerPorNombre = async (req, res) => {
  try {
    const Personaje = getPersonaje();
    const personaje = await Personaje.findOne({ 
      where: { nombre: req.params.nombre } 
    });
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
    const Personaje = getPersonaje();
    const [updated] = await Personaje.update(req.body, { 
      where: { nombre: req.params.nombre } 
    });
    if (updated === 0) {
      return res.status(404).json({ error: 'Personaje no encontrado' });
    }
    const personaje = await Personaje.findOne({ 
      where: { nombre: req.params.nombre } 
    });
    res.json(personaje);
  } catch (error) {
    console.error('Error al modificar personaje:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.eliminar = async (req, res) => {
  try {
    const Personaje = getPersonaje();
    const deleted = await Personaje.destroy({ 
      where: { nombre: req.params.nombre } 
    });
    if (deleted === 0) {
      return res.status(404).json({ error: 'Personaje no encontrado' });
    }
    res.json({ mensaje: 'Personaje eliminado' });
  } catch (error) {
    console.error('Error al eliminar personaje:', error);
    res.status(500).json({ error: error.message });
  }
};
