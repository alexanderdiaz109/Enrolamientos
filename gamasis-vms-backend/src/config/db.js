const { Pool } = require('pg');

// DATOS HARDCODED PARA ELIMINAR EL ERROR DE DOTENVX
const pool = new Pool({
  user: 'postgres.vlzjtxnkvdaxsqtbcqiy',
  host: 'aws-1-us-east-1.pooler.supabase.com',
  database: 'postgres',
  password: 'Gamasis2026', // La nueva que acabas de poner
  port: 6543,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error real:', err.message);
  } else {
    console.log('✅ ¡CONEXIÓN EXITOSA! Hora del servidor:', res.rows[0].now);
  }
});

module.exports = pool;
