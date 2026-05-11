const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
const { registrarLog } = require('../utils/logger');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const getAllUsers = async () => {
    const { rows } = await db.query(
        'SELECT id, nombre, email, creado_en, foto_url, rol FROM usuarios ORDER BY nombre ASC'
    );
    return rows;
};

const createUser = async (userData) => {
    const { nombre, email, password } = userData;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { rows } = await db.query(
        'INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1, $2, $3) RETURNING id, nombre, email',
        [nombre, email, hashedPassword]
    );
    return rows[0];
};

const uploadAvatar = async (id_usuario, fileBuffer, fileMimeType, fileName) => {
    try {
        const fileExt = fileName.split('.').pop();
        const finalFileName = `${id_usuario}-${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('avatares')
            .upload(finalFileName, fileBuffer, {
                contentType: fileMimeType,
                upsert: true
            });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
            .from('avatares')
            .getPublicUrl(finalFileName);
        
        const publicUrl = publicUrlData.publicUrl;

        await db.query(
            'UPDATE usuarios SET foto_url = $1 WHERE id = $2',
            [publicUrl, id_usuario]
        );

        await registrarLog(id_usuario, 'Actualizó su foto de perfil');

        return { foto_url: publicUrl };
    } catch (error) {
        throw error;
    }
};

const updateRole = async (id_target, nuevo_rol, id_admin) => {
    const { rows } = await db.query(
        'UPDATE usuarios SET rol = $1 WHERE id = $2 RETURNING nombre, email, rol',
        [nuevo_rol, id_target]
    );
    
    // Dejamos huella en los logs de quién ascendió a quién
    if (rows[0]) {
        await registrarLog(id_admin, `Cambió el rol de ${rows[0].nombre} a ${nuevo_rol}`);
    }
    
    return rows[0];
};

module.exports = { getAllUsers, createUser, uploadAvatar, updateRole };
