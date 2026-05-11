const usuariosService = require('../services/usuarios.service');

const getUsuarios = async (req, res) => {
    try {
        const users = await usuariosService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
};

const createUsuario = async (req, res) => {
    try {
        const newUser = await usuariosService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

const actualizarAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ninguna imagen' });
        }

        const id_usuario = req.usuario.id;
        const result = await usuariosService.uploadAvatar(
            id_usuario,
            req.file.buffer,
            req.file.mimetype,
            req.file.originalname
        );

        res.status(200).json(result);
    } catch (error) {
        console.error('Error en actualizarAvatar:', error);
        res.status(500).json({ error: 'Error al subir la imagen de perfil' });
    }
};

const cambiarRol = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;
        const id_admin = req.usuario.id; // Del middleware de auth

        if (!rol) return res.status(400).json({ error: 'El rol es requerido' });

        const updatedUser = await usuariosService.updateRole(id, rol, id_admin);
        
        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Rol actualizado', usuario: updatedUser });
    } catch (error) {
        console.error('Error al cambiar rol:', error);
        res.status(500).json({ error: 'Error al actualizar el rol del usuario' });
    }
};

module.exports = { getUsuarios, createUsuario, actualizarAvatar, cambiarRol };
