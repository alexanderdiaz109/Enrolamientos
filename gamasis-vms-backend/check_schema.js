require('dotenv').config();
const db = require('./src/config/db');

async function test() {
  // Check logs_actividad columns
  const cols = await db.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'logs_actividad'");
  console.log('logs_actividad columns:', cols.rows.map(r => r.column_name));

  // Check the constraint - specifically what column is project_afectado
  const fk = await db.query(`
    SELECT kcu.column_name, ccu.table_name AS foreign_table, ccu.column_name AS foreign_column
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'logs_actividad'
  `);
  console.log('FK constraints:', fk.rows);

  process.exit(0);
}
test().catch(e => { console.error(e); process.exit(1); });
