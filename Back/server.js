// Importa o app configurado
const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Inicia o servidor apenas se este arquivo for executado diretamente
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}
