const { Pool } = require('pg');

const regions = [
  'us-east-1',
  'us-east-2',
  'us-west-1',
  'us-west-2',
  'eu-central-1',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ap-northeast-2',
  'ap-south-1',
  'sa-east-1',
  'ca-central-1'
];

async function testRegions() {
  for (const region of regions) {
    const host = `aws-0-${region}.pooler.supabase.com`;
    console.log(`Trying ${host}...`);
    const pool = new Pool({
      user: 'postgres.vlzjtxnkvdaxsqtbcqiy',
      host: host,
      database: 'postgres',
      password: 'u@kDST95J42kXFZ',
      port: 5432,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 3000
    });
    
    try {
      const res = await pool.query('SELECT NOW()');
      console.log(`✅ Success with region: ${region}`);
      process.exit(0);
    } catch (err) {
      if (err.message.includes('Tenant or user not found')) {
        // expected if wrong region
      } else {
        console.log(`❌ Error with ${region}: ${err.message}`);
      }
    }
    await pool.end();
  }
  console.log('❌ Could not find valid region.');
}

testRegions();
