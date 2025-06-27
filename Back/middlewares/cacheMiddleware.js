const cache = require('../cache/cache');

// Para o lint:
/**
 * Middleware para verificar cache antes de processar a requisição.
 * @param {Object} req - Objeto de requisição do Express.
 * @param {Object} res - Objeto de resposta do Express.
 * @param {Function} next - Função para passar para o próximo middleware.
 * @return {void} Não retorna um valor explícito.
 */
function cacheMiddlewares(req, res, next) {
    const chave = req.originalUrl;

    const dadosCache = cache.get(chave);

    if (dadosCache !== undefined) {
        return res.status(200).json(dadosCache);
    }

    next();
}

module.exports = { cacheMiddlewares };
