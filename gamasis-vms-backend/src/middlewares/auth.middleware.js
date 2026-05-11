const jwt = require('jsonwebtoken');

const protegerRuta = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. No hay token.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SUPABASE_ANON_KEY);
        req.usuario = decoded; // Guardamos los datos del usuario en la petición
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token no válido' });
    }
};

module.exports = protegerRuta;
