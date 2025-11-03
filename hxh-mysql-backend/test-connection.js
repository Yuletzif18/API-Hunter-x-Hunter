require('dotenv').config();
const { Sequelize } = require('sequelize');

console.log('🔍 Diagnóstico de conexión MySQL\n');

// Verificar variables de entorno
console.log('📋 Variables de entorno:');
console.log('MYSQL_URI_PERSONAJES:', process.env.MYSQL_URI_PERSONAJES ? '✅ Configurada' : '❌ No encontrada');
console.log('MYSQL_URI_HABILIDADES:', process.env.MYSQL_URI_HABILIDADES ? '✅ Configurada' : '❌ No encontrada');
console.log('PORT:', process.env.PORT || '3002 (default)');
console.log('');

// Extraer información de la URI (sin mostrar la contraseña completa)
if (process.env.MYSQL_URI_PERSONAJES) {
  try {
    const url = new URL(process.env.MYSQL_URI_PERSONAJES);
    console.log('📡 Información de conexión (Personajes):');
    console.log('  Host:', url.hostname);
    console.log('  Puerto:', url.port);
    console.log('  Usuario:', url.username);
    console.log('  Base de datos:', url.pathname.substring(1));
    console.log('  Contraseña:', url.password ? '***' + url.password.substring(url.password.length - 4) : '❌ No configurada');
    console.log('');
  } catch (error) {
    console.error('❌ Error al parsear la URI:', error.message);
  }
}

// Probar conexión a Personajes
console.log('🔌 Probando conexión a base de datos de Personajes...');
const sequelizePersonajes = new Sequelize(process.env.MYSQL_URI_PERSONAJES, {
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelizePersonajes.authenticate()
  .then(() => {
    console.log('✅ Conexión exitosa a base de datos de Personajes\n');
    
    // Probar conexión a Habilidades
    console.log('🔌 Probando conexión a base de datos de Habilidades...');
    const sequelizeHabilidades = new Sequelize(process.env.MYSQL_URI_HABILIDADES, {
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
    
    return sequelizeHabilidades.authenticate();
  })
  .then(() => {
    console.log('✅ Conexión exitosa a base de datos de Habilidades\n');
    console.log('🎉 Todas las conexiones funcionan correctamente!');
    process.exit(0);
  })
  .catch(err => {
    console.error('\n❌ Error de conexión:');
    console.error('Tipo:', err.name);
    console.error('Mensaje:', err.message);
    console.error('\n💡 Posibles soluciones:');
    console.error('  1. Verifica que el servicio MySQL en Railway esté activo');
    console.error('  2. Revisa que las credenciales en .env sean correctas');
    console.error('  3. Asegúrate de que Railway no haya pausado el servicio por inactividad');
    console.error('  4. Verifica que el firewall no esté bloqueando la conexión');
    console.error('  5. Confirma que tu plan de Railway tenga base de datos disponible');
    process.exit(1);
  });
