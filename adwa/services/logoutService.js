const db = require('../configs/db');

exports.logout = async (userId) => {
    // Verifica se o usuário existe
    const [usuarios] =
      await db.query('SELECT * FROM usuarios WHERE id = ?', [userId]);
    if (!usuarios[0]) {
        return false;
    }
    // Remove o token
    await db.query('UPDATE usuarios SET token = NULL WHERE id = ?', [userId]);
    return true;
};
