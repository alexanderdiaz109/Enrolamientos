require('dotenv').config();
const db = require('./src/config/db');

async function test() {
  const { rows } = await db.query(`
    SELECT conname, pg_get_constraintdef(c.oid)
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'modulos'
  `);
  console.log("Constraints on modulos:", rows);
  process.exit(0);
}
test();
