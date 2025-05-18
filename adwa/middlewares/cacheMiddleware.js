const cache = require('../cache/cache');

function cacheMiddlewares(req, res, next){
    const chave = req.originalUrl;

    const dadosCache = cache.get(chave);

    if(dadosCache !== undefined){
        return res.status(200).json(dadosCache);
    }

    next();
}

module.exports = { cacheMiddlewares };