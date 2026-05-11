require('dotenv').config();
const db = require('./src/config/db');

async function migrate() {
  console.log('Agregando columna url_descarga a versiones...');
  
  // 1. Add url_descarga column to versiones
  await db.query(`
    ALTER TABLE versiones 
    ADD COLUMN IF NOT EXISTS url_descarga TEXT
  `);
  console.log('✅ Columna url_descarga agregada');

  // 2. Copy existing data from drivers to versiones
  const result = await db.query(`
    UPDATE versiones v
    SET url_descarga = d.url_descarga
    FROM drivers d
    WHERE d.id_version = v.id
      AND d.url_descarga IS NOT NULL
  `);
  console.log(`✅ ${result.rowCount} versiones actualizadas con URL de drivers`);

  // 3. Verify
  const check = await db.query(`
    SELECT numero_version, url_descarga FROM versiones ORDER BY creado_en DESC LIMIT 10
  `);
  check.rows.forEach(r => console.log(`  v${r.numero_version}: ${r.url_descarga || '(sin URL)'}`));

  process.exit(0);
}
migrate().catch(e => { console.error('Error:', e.message); process.exit(1); });
