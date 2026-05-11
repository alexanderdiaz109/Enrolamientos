require('dotenv').config();
const db = require('./src/config/db');

async function check() {
  // Check versiones columns
  const cols = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'versiones' ORDER BY ordinal_position");
  console.log('versiones columns:', cols.rows.map(r => r.column_name));

  // Check drivers table
  const dcols = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'drivers' ORDER BY ordinal_position");
  console.log('drivers columns:', dcols.rows.map(r => r.column_name));

  // Check actual data
  const data = await db.query(`
    SELECT v.id, v.numero_version, v.id_usuario, u.nombre as autor,
           d.url_descarga, d.id as driver_id
    FROM versiones v
    JOIN usuarios u ON v.id_usuario = u.id
    LEFT JOIN drivers d ON d.id_version = v.id
    ORDER BY v.creado_en DESC
    LIMIT 10
  `);
  console.log('\nVersiones with drivers:');
  data.rows.forEach(r => console.log(`  v${r.numero_version} | autor: ${r.autor} | driver_id: ${r.driver_id} | url: ${r.url_descarga}`));

  process.exit(0);
}
check().catch(e => { console.error(e.message); process.exit(1); });
