const multer = require('multer');

// Multer para Kits de distribución (ZIP, EXE, APK, etc.)
// Sin filtro de tipo para máxima flexibilidad, límite 200MB
const storage = multer.memoryStorage();

const uploadKit = multer({ 
    storage: storage,
    limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB
});

module.exports = uploadKit;
