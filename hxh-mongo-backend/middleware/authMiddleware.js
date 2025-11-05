const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hunter-x-hunter-secret-2025';

// Middleware para verificar autenticación
exports.verificarAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado. Acceso denegado.' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded; // Guardar datos del usuario en la request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Middleware para verificar rol de admin
exports.verificarAdmin = (req, res, next) => {
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ 
        error: 'Acceso denegado. Solo administradores pueden realizar esta acción.' 
      });
    }
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Error al verificar permisos' });
  }
};

// Middleware para verificar que sea admin o usuario (autenticado)
exports.verificarUsuario = (req, res, next) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Error de autenticación' });
  }
};
