require('dotenv').config();
const db = require('./src/config/db');

async function fix() {
  console.log("Fixing constraints...");
  try {
    await db.query('ALTER TABLE logs_actividad DROP CONSTRAINT IF EXISTS logs_actividad_proyecto_afectado_fkey');
    await db.query('ALTER TABLE logs_actividad ADD CONSTRAINT logs_actividad_proyecto_afectado_fkey FOREIGN KEY (proyecto_afectado) REFERENCES proyectos(id) ON DELETE CASCADE');
    console.log("✅ logs_actividad_proyecto_afectado_fkey constraint fixed to CASCADE");
    
    // Also check documentacion just in case
    await db.query('ALTER TABLE documentacion DROP CONSTRAINT IF EXISTS documentacion_id_proyecto_fkey');
    await db.query('ALTER TABLE documentacion ADD CONSTRAINT documentacion_id_proyecto_fkey FOREIGN KEY (id_proyecto) REFERENCES proyectos(id) ON DELETE CASCADE');
    console.log("✅ documentacion_id_proyecto_fkey constraint fixed to CASCADE");
  } catch (error) {
    console.error("Error updating constraints:", error.message);
  }
  process.exit(0);
}
fix();
