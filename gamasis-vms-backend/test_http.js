require('dotenv').config();

async function test() {
  const BASE = 'http://localhost:3000/api';

  // 1. Login
  const loginRes = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'alexanderdiazucan@gmail.com', password: 'Gamasis2026' })
  });
  const loginData = await loginRes.json();
  if (!loginData.token) {
    console.error('❌ Login failed:', loginData);
    return process.exit(1);
  }
  console.log('✅ Login OK, token received');

  const token = loginData.token;

  // 2. Get proyectos
  const projRes = await fetch(`${BASE}/proyectos`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const proyectos = await projRes.json();
  const id_proyecto = proyectos[0]?.id;
  console.log('Project:', proyectos[0]?.nombre, id_proyecto);

  // 3. Create modulo
  const modRes = await fetch(`${BASE}/modulos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      nombre: 'Test Modulo HTTP',
      descripcion: 'prueba http',
      id_proyecto
    })
  });

  const modData = await modRes.json();
  console.log('Status:', modRes.status);
  console.log('Response:', modData);

  process.exit(0);
}
test().catch(e => { console.error(e); process.exit(1); });
