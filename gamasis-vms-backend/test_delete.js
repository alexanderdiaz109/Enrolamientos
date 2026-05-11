require('dotenv').config();
const db = require('./src/config/db');

async function testDelete() {
  try {
    const { rows: pRows } = await db.query('SELECT id, nombre FROM proyectos LIMIT 1');
    if (pRows.length === 0) return console.log("No hay proyectos");
    const id = pRows[0].id;
    console.log(`Intentando eliminar proyecto: ${pRows[0].nombre} (${id})`);
    
    await db.query('DELETE FROM proyectos WHERE id = $1', [id]);
    console.log("Eliminado con éxito");
  } catch (err) {
    console.error("Error al eliminar:", err.message);
  }
  process.exit(0);
}
testDelete();
