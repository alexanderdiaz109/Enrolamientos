# Gamasis VMS - Frontend Documentation

El frontend de Gamasis VMS (Version Management System) es una SPA (Single Page Application) construida en React orientada a gestionar y distribuir componentes de software de manera eficiente y escalable.

## 🚀 Tecnologías Principales
- **React 18 + Vite**: Para una experiencia de desarrollo veloz y compilación óptima.
- **TailwindCSS**: Utilidad CSS para crear diseños dinámicos, adaptables y con estilo "Enterprise".
- **Zustand**: Gestión del estado global (Auth y Proyecto seleccionado) sin la complejidad de Redux.
- **React Router DOM**: Enrutamiento estático en el cliente.
- **Axios**: Cliente HTTP para consumir el backend. Incluye un interceptor de token.
- **Lucide React**: Biblioteca moderna y liviana para iconos de UI.
- **React Hot Toast**: Notificaciones amigables para el usuario.

## 📂 Arquitectura de Directorios (Feature-Sliced Design)
El proyecto está organizado modularmente por funcionalidades ("features") para mayor escalabilidad:
- \`/src/api\`: Instancia configurada de Axios.
- \`/src/components\`: Componentes compartidos y globales (ej. Sidebar, Layout, Avatares).
- \`/src/features\`: Cada característica principal tiene su propia carpeta (modulos, proyectos, versiones, docs).
  - \`/components\`: Componentes específicos de la feature.
  - \`/hooks\`: Custom hooks para abstraer la lógica y las llamadas a la API (polling incluido).
- \`/src/pages\`: Vistas de nivel superior que consumen los features.
- \`/src/store\`: Tiendas globales de Zustand (Estado de Sesión y Proyecto).

## 💡 Características Principales
1. **Refresh Silencioso (Polling & Tokens):** 
   - El sistema hace _polling_ automático cada 15 segundos para auto-refrescar listas (Módulos, Proyectos, Documentos) sin recargar la página manualmente.
   - El interceptor de Axios intercepta códigos 401 (token caducado) y ejecuta silenciosamente un refresh contra el backend para mantener al usuario logueado indefinidamente sin forzarlo a salir.
2. **Autoselección de Proyectos:** El menú lateral gestiona globalmente un proyecto activo a través de \`useProjectStore\`, lo que filtra el resto del sistema contextualmente.
3. **Galería Visual Técnica:** Módulo especializado para mostrar PDFs e imágenes nativamente sin plugins externos, organizando el conocimiento del equipo.

## 🏃 Scripts Disponibles
- \`npm run dev\`: Inicia el entorno de desarrollo local usando Vite.
- \`npm run build\`: Compila la aplicación estática lista para producción.
- \`npm run preview\`: Sirve la build compilada de manera local para pruebas pre-producción.
