require('dotenv').config();
const db = require('./src/config/db');
const modulosService = require('./src/services/modulos.service');

async function test() {
  const { rows: pRows } = await db.query('SELECT id, nombre FROM proyectos LIMIT 2');
  console.log("Proyectos:", pRows);
  if (pRows.length === 0) return console.log("No hay proyectos");

  const { rows: uRows } = await db.query('SELECT id FROM usuarios LIMIT 1');
  const userId = uRows[0].id;

  try {
    const res = await modulosService.createNewModulo({
      nombre: 'Test Module',
      descripcion: 'Testing module insert',
      id_proyecto: pRows[0].id
    }, userId);
    console.log("Success:", res);
  } catch (err) {
    console.error("Insert error:", err.message);
  }
  process.exit(0);
}
test();
