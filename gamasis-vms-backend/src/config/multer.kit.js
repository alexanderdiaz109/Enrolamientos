const multer = require('multer');

// Multer para Kits de distribución (ZIP, EXE, APK, etc.)
// Sin filtro de tipo para máxima flexibilidad, límite 2GB para instaladores grandes
const storage = multer.memoryStorage();

const uploadKit = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2 GB
});

module.exports = uploadKit;
