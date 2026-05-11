const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres.vlzjtxnkvdaxsqtbcqiy',
  host: 'aws-1-us-east-1.pooler.supabase.com',
  database: 'postgres',
  password: 'Gamasis2026',
  port: 6543,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('❌ Error:', err.message);
  else console.log('✅ CONEXIÓN EXITOSA:', res.rows[0].now);
  process.exit(err ? 1 : 0);
});
