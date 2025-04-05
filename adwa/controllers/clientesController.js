// Importa os serviços para manipulação da entidade "clientes".
const clientesService = require('../services/clientesService');

// Controlador para obter todos os clientes.
exports.getClientes = async (req, res) => {
    if (!req.body) {
        return res
            .status(404)
            .json({ message: 'Não foram encontrados clientes.' });
    }

    // Obtém todos os clientes do serviço.
    try {
        const clientes = await clientesService.getAll();
        // Retorna o cliente criado com o status 200 (Criado).
        res.status(200).json(clientes);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para criar um novo cliente.
exports.createCliente = async (req, res) => {
    // Captura os dados do corpo da requisição.
    const cliente = req.body;
    // Faz uma verificação basica
    if (!cliente) {
        return res.status(400).json({ error: 'Nenhum cliente encontrado.' });
    }
    try {
        // Chama o serviço para criar o cliente.
        const result = await clientesService.create(cliente);
        // Retorna o cliente criado com o status 201 (Criado).
        res.status(201).json({ message: 'Cliente criado com sucesso!', result});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para atualizar um cliente existente.
exports.updateCliente = async (req, res) => {
    // Captura o ID do cliente a partir dos parâmetros da requisição.
    const { id } = req.params;
    // Captura os dados atualizados do corpo da requisição.
    const cliente = req.body;

    if (!cliente || !id) {
        return res.status(400).json({ error: 'Cliente não encontrado' });
    }

    try {
        // Atualiza o cliente chamando o serviço.
        const result = await clientesService.update(id, cliente);
        // Retorna o cliente atualizado.
        res.status(201).json({
            message: 'Cliente atualizado com sucesso!',
            result,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Controlador para excluir um cliente.
exports.deleteCliente = async (req, res) => {
    // Captura o ID do cliente a partir dos parâmetros da requisição.
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Cliente não encontrado' });
    }

    try {
        // Chama o serviço para excluir o cliente.
        const result = await clientesService.delete(id);
        // Retorna o resultado da operação.
        res.status(201).json({
            message: 'Cliente deletado com sucesso!',
            result,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
