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
    const { usuario: nomeUsuario, senhaAntiga, senhaNova } = usuario;
    // Busca o usuário atual
    const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    const user = rows[0];
    if (!user) {
        throw new Error('Usuário não encontrado.');
    }
    // Se for atualizar senha, verifica a senha antiga
    if (senhaNova) {
        const senhaCorreta = await bcrypt.compare(senhaAntiga, user.senha);
        if (!senhaCorreta) {
            throw new Error('Senha atual incorreta.');
        }
        const hashedSenha = await bcrypt.hash(senhaNova, saltRounds);
        const [result] = await db.query(
            'UPDATE usuarios SET usuario = ?, senha = ? WHERE id = ?',
            [nomeUsuario, hashedSenha, id]);
        return { affectedRows: result.affectedRows };
    } else {
        const [result] = await db.query(
            'UPDATE usuarios SET usuario = ? WHERE id = ?', [nomeUsuario, id]);
        return { affectedRows: result.affectedRows };
    }
};

exports.getById = async (id) => {
    const [rows] = await db.query(
        'SELECT id, usuario FROM usuarios WHERE id = ?', [id]);
    return rows[0] || null;
};
