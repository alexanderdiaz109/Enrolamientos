require('dotenv').config();
const app = require('./app');
const pool = require('./config/db'); // Esto dispara la prueba de conexión

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
