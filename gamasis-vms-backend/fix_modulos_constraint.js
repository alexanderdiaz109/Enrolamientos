require('dotenv').config();
const db = require('./src/config/db');

async function fix() {
  console.log("Fixing constraints...");
  
  try {
    await db.query('ALTER TABLE modulos DROP CONSTRAINT IF EXISTS modulos_nombre_key');
    console.log("✅ modulos_nombre_key constraint dropped");
    
    // Create new constraint unique per project
    await db.query('ALTER TABLE modulos ADD CONSTRAINT modulos_proyecto_nombre_key UNIQUE (id_proyecto, nombre)');
    console.log("✅ modulos_proyecto_nombre_key constraint added");
    
  } catch (error) {
    console.error("Error updating constraints:", error.message);
  }
  process.exit(0);
}
fix();
