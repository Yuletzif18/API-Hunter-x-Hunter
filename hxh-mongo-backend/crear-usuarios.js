require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Conectar a MongoDB
const uriPersonajes = process.env.MONGODB_URI_PERSONAJES;

mongoose.connect(uriPersonajes)
  .then(async () => {
    console.log('✅ Conectado a MongoDB Atlas');

    // Definir esquema de Usuario
    const usuarioSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      rol: { type: String, enum: ['admin', 'usuario'], default: 'usuario' },
      createdAt: { type: Date, default: Date.now }
    });

    const Usuario = mongoose.model('Usuario', usuarioSchema, 'usuarios');

    // Limpiar usuarios existentes (opcional - comentar en producción)
    // await Usuario.deleteMany({});
    // console.log('🗑️ Usuarios anteriores eliminados');

    // Crear usuarios iniciales
    const usuariosIniciales = [
      {
        username: 'admin',
        password: 'admin123',
        rol: 'admin'
      },
      {
        username: 'usuario1',
        password: 'user123',
        rol: 'usuario'
      }
    ];

    for (const userData of usuariosIniciales) {
      // Verificar si ya existe
      const existente = await Usuario.findOne({ username: userData.username });
      
      if (existente) {
        console.log(`⚠️ Usuario '${userData.username}' ya existe, saltando...`);
        continue;
      }

      // Encriptar contraseña
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(userData.password, salt);

      // Crear usuario
      const nuevoUsuario = new Usuario({
        username: userData.username,
        password: passwordHash,
        rol: userData.rol
      });

      await nuevoUsuario.save();
      console.log(`✅ Usuario '${userData.username}' creado con rol '${userData.rol}'`);
    }

    console.log('\n📋 Resumen de usuarios:');
    console.log('====================================');
    console.log('Admin:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('  Rol: admin (puede hacer CRUD completo)');
    console.log('');
    console.log('Usuario:');
    console.log('  Username: usuario1');
    console.log('  Password: user123');
    console.log('  Rol: usuario (solo lectura)');
    console.log('====================================\n');

    mongoose.connection.close();
    console.log('✅ Script finalizado. Conexión cerrada.');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
