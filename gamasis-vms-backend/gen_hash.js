const bcrypt = require('bcryptjs');

async function generateHash() {
  const hash = await bcrypt.hash('Gamasis2026', 10);
  console.log('Hash real para Supabase:');
  console.log(hash);
  console.log('\nSQL para copiar en Supabase:');
  console.log(`INSERT INTO usuarios (nombre, email, password_hash)`);
  console.log(`VALUES ('Alexander', 'alexanderdiazucan@gmail.com', '${hash}');`);
}

generateHash();
