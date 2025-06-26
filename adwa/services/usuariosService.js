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

exports.delete = async (id) => {
    // Verifica se o usuário existe
    const [existingUser] =
        await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (!existingUser || existingUser.length === 0) {
        throw new Error('Usuário não encontrado.');
    }
    // Deleta o usuário
    await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    return { message: 'Usuário deletado com sucesso!', deletedId: id };
};

exports.update = async (id, usuario) => {
    const { usuario: nomeUsuario, senha } = usuario;
    let query, params;
    if (senha) {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const hashedSenha = await bcrypt.hash(senha, saltRounds);
        query = 'UPDATE usuarios SET usuario = ?, senha = ? WHERE id = ?';
        params = [nomeUsuario, hashedSenha, id];
    } else {
        query = 'UPDATE usuarios SET usuario = ? WHERE id = ?';
        params = [nomeUsuario, id];
    }
    const [result] = await db.query(query, params);
    return { affectedRows: result.affectedRows };
};
