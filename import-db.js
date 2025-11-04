const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function importToRailway() {
  const connection = await mysql.createConnection({
    host: 'turntable.proxy.rlwy.net',
    port: 43086,
    user: 'root',
    password: 'DAPVFQBAlCNIWccicUNOxHgAEjHuFlhf',
    database: 'railway',
    multipleStatements: true
  });

  console.log('✓ Conectado a Railway MySQL');

  try {
    // Importar personajes
    console.log('\nImportando personajes_hunterxhunter...');
    const personajesSQL = await fs.readFile(path.join(__dirname, 'BD', 'personajes_fixed.sql'), 'utf8');
    await connection.query(personajesSQL);
    console.log('✓ Personajes importados');

    // Importar habilidades
    console.log('\nImportando habilidades_hunterxhunter...');
    const habilidadesSQL = await fs.readFile(path.join(__dirname, 'BD', 'habilidades_fixed.sql'), 'utf8');
    await connection.query(habilidadesSQL);
    console.log('✓ Habilidades importadas');

    // Verificar datos
    const [personajes] = await connection.query('SELECT COUNT(*) as count FROM personajes_hunterxhunter');
    const [habilidades] = await connection.query('SELECT COUNT(*) as count FROM habilidades_hunterxhunter');

    console.log(`\n✓ Total personajes: ${personajes[0].count}`);
    console.log(`✓ Total habilidades: ${habilidades[0].count}`);

    console.log('\n=== Importación completada exitosamente ===');
    console.log('\nConnection URL para Railway variables:');
    console.log('MYSQL_URI_PERSONAJES=mysql://root:DAPVFQBAlCNIWccicUNOxHgAEjHuFlhf@mysql.railway.internal:3306/railway');
    console.log('MYSQL_URI_HABILIDADES=mysql://root:DAPVFQBAlCNIWccicUNOxHgAEjHuFlhf@mysql.railway.internal:3306/railway');

  } catch (error) {
    console.error('✗ Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

importToRailway().catch(console.error);
