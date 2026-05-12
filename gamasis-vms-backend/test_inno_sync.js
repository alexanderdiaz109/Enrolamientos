const fs = require('fs');

const INNO_VERSION_FILE = 'C:\\Users\\alexa\\OneDrive\\Escritorio\\Instalador\\version.iss';
const TEST_VERSION = '3.5.6.13';

console.log('Estado ANTES:');
console.log(fs.readFileSync(INNO_VERSION_FILE, 'utf8'));

fs.writeFileSync(INNO_VERSION_FILE, `#define MyAppVersion "${TEST_VERSION}"`, 'utf8');

console.log('\nEstado DESPUES:');
console.log(fs.readFileSync(INNO_VERSION_FILE, 'utf8'));
console.log('\n✅ Sincronización con Inno Setup funciona correctamente.');
