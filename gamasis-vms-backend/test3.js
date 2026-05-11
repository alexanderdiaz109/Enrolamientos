require('dotenv').config();
const db = require('./src/config/db');
const modulosService = require('./src/services/modulos.service');

async function testService() {
  const { rows } = await db.query('SELECT id FROM proyectos LIMIT 1');
  const proj_id = rows[0]?.id;
  const user_id = 'c13c7bb9-e0d0-4b36-aeb2-dc18d6e355eb'; // dummy uuid
  
  try {
    const res = await modulosService.createNewModulo({
      nombre: 'Prueba Service',
      descripcion: 'Service desc',
      id_proyecto: proj_id
    }, user_id);
    console.log('Result:', res);
  } catch(e) {
    console.error('Service error:', e);
  }
  process.exit(0);
}

testService();
