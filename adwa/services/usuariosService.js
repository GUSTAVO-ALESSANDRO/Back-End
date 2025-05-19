const db = require('../configs/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.create = async (usuario, senha) => {
    // Verifica se já existe um usuário com o mesmo nome
    const [existingUsers] =
        await db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
    if (existingUsers && existingUsers.length > 0) {
        throw new Error('Usuário já existe.');
    }
    // Criptografa a senha utilizando o bcrypt
    const hashedSenha = await bcrypt.hash(senha, saltRounds);
    // Insere o novo usuário na tabela "usuarios"
    const [result] =
        await db.query('INSERT INTO usuarios (usuario, senha) VALUES (?, ?)',
            [usuario, hashedSenha]);
    // Retorna o usuário criado com seu ID
    return { id: result.insertId, usuario };
};

exports.getAll = async () => {
    const [rows] = await db.query('SELECT id, usuario FROM usuarios');
    return rows;
};
