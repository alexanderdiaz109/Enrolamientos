require('dotenv').config();
const db = require('./src/config/db');
db.query("SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'modulos'")
  .then(res => { console.log(res.rows); process.exit(0); })
  .catch(err => { console.error(err); process.exit(1); });
