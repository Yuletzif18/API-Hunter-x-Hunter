const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret key para JWT (en producción debe estar en .env)
const JWT_SECRET = process.env.JWT_SECRET || 'hunter-x-hunter-secret-2025';

// Registrar nuevo usuario
exports.registrar = async (req, res) => {
  try {
    const { username, password, rol } = req.body;

    // Validar campos requeridos
    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ username });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      username,
      password: passwordHash,
      rol: rol || 'usuario' // Por defecto es 'usuario'
    });

    await nuevoUsuario.save();

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: nuevoUsuario._id,
        username: nuevoUsuario.username,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar campos requeridos
    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password son requeridos' });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ username });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: usuario._id, 
        username: usuario.username, 
        rol: usuario.rol 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        username: usuario.username,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Verificar token
exports.verificarToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar usuario actualizado
    const usuario = await Usuario.findById(decoded.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({
      valido: true,
      usuario: {
        id: usuario._id,
        username: usuario.username,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error al verificar token:', error);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Listar todos los usuarios (solo admin)
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};
