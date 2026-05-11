require('dotenv').config();
const db = require('./src/config/db');
const { createClient } = require('@supabase/supabase-js');

async function debugDocs() {
  // 1. Check if documentacion table exists and its columns
  const cols = await db.query(`
    SELECT column_name, data_type, is_nullable 
    FROM information_schema.columns 
    WHERE table_name = 'documentacion' 
    ORDER BY ordinal_position
  `);
  console.log('documentacion table columns:', cols.rows.length > 0 ? cols.rows : '❌ TABLE DOES NOT EXIST');

  if (cols.rows.length === 0) {
    console.log('\n📋 Creating documentacion table...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS documentacion (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        id_proyecto UUID REFERENCES proyectos(id) ON DELETE CASCADE,
        id_usuario UUID REFERENCES usuarios(id),
        titulo VARCHAR(200) NOT NULL,
        descripcion TEXT,
        tipo VARCHAR(50) DEFAULT 'pdf',
        url_archivo TEXT,
        creado_en TIMESTAMPTZ DEFAULT NOW()
      )
    `);
    console.log('✅ Table created');
  }

  // 2. Test storage upload with service key
  const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const testContent = Buffer.from('test doc content');
  const { error } = await supabaseAdmin.storage
    .from('documentacion')
    .upload('test/test.txt', testContent, { contentType: 'text/plain', upsert: true });
  
  if (error) {
    console.log('\n❌ Storage upload to documentacion FAILED:', error.message);
  } else {
    console.log('\n✅ Storage upload to documentacion works');
    await supabaseAdmin.storage.from('documentacion').remove(['test/test.txt']);
  }

  process.exit(0);
}
debugDocs().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
