require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function findBucket() {
  const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  
  // List all buckets
  const { data: buckets, error } = await supabaseAdmin.storage.listBuckets();
  if (error) {
    console.error('Error listing buckets:', error.message);
    return process.exit(1);
  }
  
  console.log('All buckets in Supabase Storage:');
  buckets.forEach(b => console.log(`  - "${b.name}" (public: ${b.public})`));
  
  process.exit(0);
}
findBucket().catch(e => { console.error(e); process.exit(1); });
