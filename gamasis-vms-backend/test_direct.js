const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'db.vlzjtxnkvdaxsqtbcqiy.supabase.co',
  database: 'postgres',
  password: 'u@kDST95J42kXFZ',
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('Error:', err.message);
  else console.log('✅ Direct connection success:', res.rows[0]);
  process.exit(err ? 1 : 0);
});
