require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function testStorage() {
  console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
  console.log('SERVICE_KEY (primeros 20 chars):', process.env.SUPABASE_SERVICE_KEY?.substring(0, 20));

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  // Crear un archivo de prueba pequeño en memoria
  const testContent = Buffer.from('test file content for upload');
  const testPath = 'test-proyecto/test-cliente/v1.0/kit-v1.0.txt';

  console.log('\n--- Test: Upload a bucket versiones ---');
  const { data, error } = await supabase.storage
    .from('versiones')
    .upload(testPath, testContent, {
      contentType: 'text/plain',
      upsert: true
    });

  if (error) {
    console.error('❌ Upload FAILED:', error.message);
    console.error('   Status:', error.statusCode);
    console.error('   Error:', error.error);
  } else {
    console.log('✅ Upload SUCCESS:', data);
    const { data: urlData } = supabase.storage.from('versiones').getPublicUrl(testPath);
    console.log('✅ Public URL:', urlData.publicUrl);

    // Cleanup
    await supabase.storage.from('versiones').remove([testPath]);
    console.log('✅ Test file cleaned up');
  }

  process.exit(0);
}

testStorage().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
