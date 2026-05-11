const multer = require('multer');

// Configuramos para guardar en memoria, no en disco,
// para enviarlo directo a Supabase
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Límite 2MB
    fileFilter: (req, file, cb) => {
        // Solo aceptamos imágenes
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (jpg, png)'));
        }
    }
});

module.exports = upload;
