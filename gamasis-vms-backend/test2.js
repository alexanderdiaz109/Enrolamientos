require('dotenv').config();
const db = require('./src/config/db');

async function testInsert() {
  const nombre = 'Prueba 1';
  const descripcion = 'desc';
  const id_proyecto = '9195b057-bd7b-4d40-b6ab-3f9547d2ce89'; // wait, I don't know a valid project UUID.
  
  // Let's get a project UUID first
  const { rows } = await db.query('SELECT id FROM proyectos LIMIT 1');
  const proj_id = rows[0]?.id;
  if (!proj_id) { console.log('No projects'); return; }

  console.log('Project ID:', proj_id);
  
  try {
    const query = 'INSERT INTO modulos (nombre, descripcion, id_proyecto) VALUES ($1, $2, $3) RETURNING *';
    const values = [nombre, descripcion, proj_id];
    const { rows: inserted } = await db.query(query, values);
    console.log('Inserted:', inserted);
  } catch(e) {
    console.error('Error inserting module:', e);
  }
  process.exit(0);
}

testInsert();
