const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const login = async (email, password) => {
    // 1. Buscar al usuario
    const { rows } = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const usuario = rows[0];

    if (!usuario) throw new Error('Usuario no encontrado');

    // 2. Verificar contraseña
    const isMatch = await bcrypt.compare(password, usuario.password_hash);
    if (!isMatch) throw new Error('Contraseña incorrecta');

    // 3. Generar JWT (Expira en 24h)
    const token = jwt.sign(
        { id: usuario.id, email: usuario.email, rol: usuario.rol },
        process.env.SUPABASE_ANON_KEY,
        { expiresIn: '24h' }
    );

    return { token, usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } };
};

const renovarToken = async (oldToken) => {
    try {
        // Decodificar ignorando expiración para poder renovarlo
        const decoded = jwt.verify(oldToken, process.env.SUPABASE_ANON_KEY, { ignoreExpiration: true });
        
        // Verificar que el usuario aún exista
        const { rows } = await db.query('SELECT id, email, rol, nombre FROM usuarios WHERE id = $1', [decoded.id]);
        const usuario = rows[0];
        
        if (!usuario) throw new Error('Usuario no encontrado');

        // Generar nuevo token con expiración renovada
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            process.env.SUPABASE_ANON_KEY,
            { expiresIn: '24h' }
        );

        return { token, usuario };
    } catch (error) {
        throw new Error('Token inválido para renovación');
    }
};

module.exports = { login, renovarToken };
