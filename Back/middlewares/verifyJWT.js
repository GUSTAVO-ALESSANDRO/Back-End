const jwt = require('jsonwebtoken');
const db = require('../configs/db');
require('dotenv').config();
const SECRET = process.env.SECRET || 'chave-secreta-padrao';

// Necessario para o lint:
/**
 * Middleware para validar JWT.
 * @param {Object} req - Objeto de requisição do Express.
 * @param {Object} res - Objeto de resposta do Express.
 * @param {Function} next - Função para passar para o próximo middleware.
 * @return {void} Não retorna um valor explícito.
 */
function verifyJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' });
        }

        // Verifica se o token ainda existe no banco
        try {
            const [usuarios] = await db.query(
                'SELECT token FROM usuarios WHERE id = ?', [decoded.id]);

            if (!usuarios[0] || usuarios[0].token !== token) {
                return res.status(401).json({
                    error: 'Token inválido ou expirado' });
            }

            req.userId = decoded.id;
            next();
        } catch (dbError) {
            return res.status(401)
                .json({ error: 'Erro na validação do token' });
        }
    });
}

module.exports = verifyJWT;
