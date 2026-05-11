async function test() {
  try {
    const res = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alexanderdiazucan@gmail.com', password: 'Gamasis2026' })
    });
    const data = await res.json();
    const token = data.token;
    
    // get proyectos
    const projRes = await fetch('http://localhost:3000/api/proyectos', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const projData = await projRes.json();
    const projId = projData[0]?.id;
    console.log('Project ID:', projId);
    
    // create modulo
    const modRes = await fetch('http://localhost:3000/api/modulos', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify({
        nombre: 'Test Module',
        descripcion: 'desc',
        id_proyecto: projId
      })
    });
    const modData = await modRes.json();
    console.log('Status:', modRes.status);
    console.log('Response:', modData);
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
