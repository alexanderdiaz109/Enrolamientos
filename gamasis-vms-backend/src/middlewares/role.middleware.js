const soloAdmin = (req, res, next) => {
    const rol = req.usuario?.rol?.toLowerCase();
    if (rol === 'admin' || rol === 'administrador') {
        next();
    } else {
        res.status(403).json({ error: 'Permisos insuficientes. Solo el Administrador puede realizar esta acción.' });
    }
};

module.exports = { soloAdmin };
