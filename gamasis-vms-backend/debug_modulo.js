require('dotenv').config();
const db = require('./src/config/db');

async function test() {
  // Get a real user id and project id to test with
  const users = await db.query('SELECT id, email FROM usuarios LIMIT 3');
  console.log('Users:', users.rows);

  const projects = await db.query('SELECT id, nombre FROM proyectos LIMIT 3');
  console.log('Projects:', projects.rows);

  if (users.rows.length === 0 || projects.rows.length === 0) {
    console.log('No users or projects found');
    process.exit(0);
  }

  const id_usuario = users.rows[0].id;
  const id_proyecto = projects.rows[0].id;

  // Test 1: insert modulo directly
  console.log('\n--- Test: INSERT modulo ---');
  try {
    const { rows } = await db.query(
      'INSERT INTO modulos (nombre, descripcion, id_proyecto) VALUES ($1, $2, $3) RETURNING *',
      ['Test Modulo Debug', 'desc', id_proyecto]
    );
    console.log('✅ Module inserted:', rows[0].id);
    // cleanup
    await db.query('DELETE FROM modulos WHERE id = $1', [rows[0].id]);
  } catch(e) {
    console.error('❌ Module insert failed:', e.message);
  }

  // Test 2: registrarLog
  console.log('\n--- Test: registrarLog ---');
  try {
    await db.query(
      'INSERT INTO logs_actividad (id_usuario, accion, proyecto_afectado) VALUES ($1, $2, $3)',
      [id_usuario, 'Test log', id_proyecto]
    );
    console.log('✅ Log inserted');
  } catch(e) {
    console.error('❌ Log insert failed:', e.message);
    console.error('Detail:', e.detail);
  }

  process.exit(0);
}
test().catch(e => { console.error(e); process.exit(1); });
