(async () => {
  try {
    const API = 'http://localhost:3001/api';
    const registerData = { nombre: 'Prueba', email: 'prueba.user@example.com', contraseña: 'Password123' };

    console.log('-> Intentando registrar usuario de prueba...');
    let res = await fetch(`${API}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerData)
    }).catch(e => { throw e; });

    const textReg = await res.text();
    console.log('Registro status:', res.status);
    console.log('Registro body:', textReg);

    if (!res.ok && res.status !== 400) { // 400 puede significar que ya existe
      throw new Error('Registro falló');
    }

    console.log('\n-> Intentando iniciar sesión...');
    res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: registerData.email, contraseña: registerData.contraseña })
    });

    const textLogin = await res.text();
    console.log('Login status:', res.status);
    console.log('Login body:', textLogin);

    if (!res.ok) throw new Error('Login falló');

    const loginJson = JSON.parse(textLogin);
    const token = loginJson.token;

    console.log('\n-> Solicitando perfil con token...');
    res = await fetch(`${API}/usuario/perfil`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const perfil = await res.text();
    console.log('Perfil status:', res.status);
    console.log('Perfil body:', perfil);

    console.log('\nPrueba finalizada.');
  } catch (err) {
    console.error('Error en testAuth:', err);
    process.exit(1);
  }
})();
