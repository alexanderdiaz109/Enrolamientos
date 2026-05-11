const authService = require('../services/auth.service');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos' });
        }

        const data = await authService.login(email, password);

        res.status(200).json({
            message: 'Login exitoso',
            ...data
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

const refresh = async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'No token provided' });

        const data = await authService.renovarToken(token);
        res.status(200).json({
            message: 'Token renovado',
            ...data
        });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

module.exports = { login, refresh };
