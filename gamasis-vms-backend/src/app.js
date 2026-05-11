const express = require('express');
const cors = require('cors');
const modulosRoutes = require('./routes/modulos.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const versionesRoutes = require('./routes/versiones.routes');
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const proyectosRoutes = require('./routes/proyectos.routes');
const docsRoutes = require('./routes/docs.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Registro de rutas con prefijo /api
app.use('/api/auth', authRoutes);
app.use('/api/proyectos', proyectosRoutes);
app.use('/api/modulos', modulosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/versiones', versionesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/docs', docsRoutes);

app.get('/', (req, res) => {
  res.json({ message: "API Gamasis VMS funcionando 🚀" });
});

module.exports = app;
