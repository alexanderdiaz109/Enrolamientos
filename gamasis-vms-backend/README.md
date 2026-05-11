# Gamasis VMS - Backend Documentation

El backend del sistema Gamasis VMS (Version Management System) es una API RESTFul construida en Node.js con Express, que gestiona la base de datos PostgreSQL alojada en Supabase y el almacenamiento de archivos (Storage).

## 🚀 Tecnologías Principales
- **Node.js & Express**: Framework principal del servidor web.
- **PostgreSQL (Supabase)**: Base de datos relacional para guardar proyectos, módulos, versiones y logs.
- **Supabase Storage**: Almacenamiento en la nube para guardar avatares, archivos ZIP de versiones y documentos técnicos.
- **JWT (JSON Web Tokens)**: Sistema de autenticación stateless.
- **Multer**: Middleware para recibir y procesar archivos multipart/form-data.

## 📂 Estructura del Proyecto
El proyecto sigue una arquitectura limpia basada en capas (MVC/Servicios):
- \`/src/config\`: Configuración global (ej. conexión a \`db.js\`).
- \`/src/controllers\`: Lógica de negocio HTTP, recibe req y responde res.
- \`/src/services\`: Lógica de base de datos directa.
- \`/src/routes\`: Definición de endpoints de la API.
- \`/src/middlewares\`: Filtros e interceptores (ej. \`auth.middleware.js\` para proteger rutas).

## 🔑 Autenticación (Auth)
- El login recibe email y contraseña, las comprara usando \`bcrypt\` y genera un JWT firmado con la llave de Supabase.
- **Renovación Silenciosa:** Existe un endpoint \`POST /api/auth/refresh\` que intercepta tokens caducados y genera unos nuevos automáticamente para evitar desloguear al usuario.

## 🗄️ Supabase Storage & RLS
- Para bypasear las reglas restrictivas de lectura/escritura (RLS) en Supabase Storage, el sistema utiliza un cliente de administración (\`supabaseAdmin\`) que carga la variable \`SUPABASE_SERVICE_KEY\`.
- **Buckets utilizados**:
  - \`avatares\`: Fotos de perfil de usuarios.
  - \`versiones\`: Archivos subidos (ZIP, instaladores) asociados a una versión técnica.
  - \`documentacion\`: Archivos técnicos, manuales y diagramas.

## ⚙️ Variables de Entorno (.env)
Para correr el proyecto localmente, asegúrate de tener las siguientes variables:
PORT=3000
DB_USER=...
DB_HOST=...
DB_PASSWORD=...
DB_PORT=6543
DB_NAME=postgres
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=... (Indispensable para subir archivos)

## 🏃 Scripts Disponibles
- \`npm run dev\`: Inicia el servidor usando nodemon para recarga en caliente.
- \`npm start\`: Inicia el servidor para producción.
