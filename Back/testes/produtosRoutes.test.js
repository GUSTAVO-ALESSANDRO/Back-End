const request = require('supertest');
const app = require('../app');
const palavra255 = 'A'.repeat(255);
const palavra256 = 'A'.repeat(256);

describe('Testes completos para rotas de produtos', () => {
    let createdProductIds = [];
    let createdProductNames = [];

    const cleanupProdutos = async () => {
        for (const id of createdProductIds) {
            try {
                await request(app).delete(`/produtos/${id}`);
            } catch (e) {}
        }
        createdProductIds = [];
        // Limpa por nome caso algum produto não tenha
        // sido registrado no array de IDs
        for (const nome of createdProductNames) {
            try {
                const [res] = await app.db.query(
                    'SELECT id FROM produtos WHERE nome = ?', [nome]);
                if (res && res.length > 0) {
                    const id = res[0].id;
                    await request(app).delete(`/produtos/${id}`);
                }
            } catch (e) {}
        }
        createdProductNames = [];
    };

    beforeAll(async () => {
        // Cria um usuário admin para os testes (pode falhar se já existir)
        try {
            await request(app)
                .post('/usuarios')
                .send({
                    usuario: 'admin',
                    senha: 'admin123',
                });
        } catch (error) {}
    });

    afterEach(async () => {
        await cleanupProdutos();
    });

    afterAll(async () => {
        await cleanupProdutos();
    });

    /**
     * Gera um nome de produto único baseado em um sufixo e timestamp atual.
     * Útil para evitar duplicidade em testes automatizados.
     * @param {string} suffix - Um identificador para distinguir o produto.
     * @return {string} Nome exclusivo
     */
    function uniqueProductName(suffix) {
        return `Produto_Teste_${suffix}_${Date.now()}`;
    }


    // Testes de validação de nome
    it('deve rejeitar nome com menos de 3 caracteres', async () => {
        const res = await request(app)
            .post('/produtos')
            .send({
                nome: 'ab',
                descricao: 'Descricao',
                preco: 10.50,
            });
        expect(res.status).toBe(400);
    });

    it('deve aceitar nome com exatamente 3 caracteres', async () => {
        const produto = {
            nome: 'abc',
            descricao: 'Descricao',
            preco: 10.50,
        };
        createdProductNames.push(produto.nome);
        const res = await request(app)
            .post('/produtos')
            .send(produto);
        expect(res.status).toBe(201);
        if (res.body.id) {
            createdProductIds.push(res.body.id);
        }
    });

    it('deve aceitar nome com 255 caracteres', async () => {
        const produto = {
            nome: palavra255,
            descricao: 'Descricao',
            preco: 10.50,
        };
        createdProductNames.push(produto.nome);
        const res = await request(app)
            .post('/produtos')
            .send(produto);
        expect(res.status).toBe(201);
        if (res.body.id) {
            createdProductIds.push(res.body.id);
        }
    });

    it('deve rejeitar nome com 256 caracteres', async () => {
        const produto = {
            nome: palavra256,
            descricao: 'Descricao',
            preco: 10.50,
        };
        const res = await request(app)
            .post('/produtos')
            .send(produto);
        expect(res.status).toBe(400);
    });

    // Testes de validação de descrição
    it('deve rejeitar descrição com menos de 3 caracteres', async () => {
        const res = await request(app)
            .post('/produtos')
            .send({
                nome: uniqueProductName('descCurta'),
                descricao: 'ab',
                preco: 10.50,
            });
        expect(res.status).toBe(400);
    });

    it('deve aceitar descrição com exatamente 3 caracteres', async () => {
        const produto = {
            nome: uniqueProductName('desc3'),
            descricao: 'abc',
            preco: 10.50,
        };
        createdProductNames.push(produto.nome);
        const res = await request(app)
            .post('/produtos')
            .send(produto);
        expect(res.status).toBe(201);
        if (res.body.id) {
            createdProductIds.push(res.body.id);
        }
    });

    it('deve aceitar descrição com 255 caracteres', async () => {
        const produto = {
            nome: uniqueProductName('desc255'),
            descricao: palavra255,
            preco: 10.50,
        };
        createdProductNames.push(produto.nome);
        const res = await request(app)
            .post('/produtos')
            .send(produto);
        expect(res.status).toBe(201);
        if (res.body.id) {
            createdProductIds.push(res.body.id);
        }
    });

    it('deve rejeitar descrição com mais de 255 caracteres', async () => {
        const produto = {
            nome: uniqueProductName('desc256'),
            descricao: palavra256,
            preco: 10.50,
        };
        const res = await request(app)
            .post('/produtos')
            .send(produto);
        expect(res.status).toBe(400);
    });

    // Testes de validação de preço
    it('deve aceitar preço igual a 0', async () => {
        const produto = {
            nome: uniqueProductName('preco0'),
            descricao: 'Produto sem custo',
            preco: 0,
        };
        createdProductNames.push(produto.nome);
        const res = await request(app)
            .post('/produtos')
            .send(produto);
        expect(res.status).toBe(201);
        expect(res.body.preco).toBe(0);
        const id = res.body.id || res.body.result?.insertId;
        if (id) {
            createdProductIds.push(id);
        }
    });

    it('deve aceitar preço positivo', async () => {
        const produto = {
            nome: uniqueProductName('precoPos'),
            descricao: 'Produto com preço alto',
            preco: 999.99,
        };
        createdProductNames.push(produto.nome);
        const res = await request(app)
            .post('/produtos')
            .send(produto);
        expect(res.status).toBe(201);
        expect(res.body.preco).toBe(999.99);
        const id = res.body.id || res.body.result?.insertId;
        if (id) {
            createdProductIds.push(id);
        }
    });

    it('deve rejeitar preço negativo', async () => {
        const res = await request(app)
            .post('/produtos')
            .send({
                nome: uniqueProductName('precoNeg'),
                descricao: 'Produto com preço negativo',
                preco: -10.50,
            });
        expect(res.status).toBe(400);
    });

    // Testes de validação de dataAtualizado
    it('deve aceitar dataAtualizado válida', async () => {
        const produto = {
            nome: uniqueProductName('dataValida'),
            descricao: 'Produto com data de atualização',
            preco: 50.00,
            dataAtualizado: '2024-01-15 10:30:00',
        };
        createdProductNames.push(produto.nome);
        const res = await request(app)
            .post('/produtos')
            .send(produto);
        expect(res.status).toBe(201);
        expect(res.body.nome).toBe(produto.nome);
        const id = res.body.id || res.body.result?.insertId;
        if (id) {
            createdProductIds.push(id);
        }
    });

    it('deve rejeitar dataAtualizado anterior a 01/01/2000', async () => {
        const res = await request(app)
            .post('/produtos')
            .send({
                nome: uniqueProductName('dataAntiga'),
                descricao: 'Produto com data muito antiga',
                preco: 50.00,
                dataAtualizado: '1999-12-31 00:00:00',
            });
        expect(res.status).toBe(400);
    });

    it('deve rejeitar dataAtualizado posterior a 20/06/2025', async () => {
        const res = await request(app)
            .post('/produtos')
            .send({
                nome: uniqueProductName('dataFutura'),
                descricao: 'Produto com data no futuro',
                preco: 50.00,
                dataAtualizado: '2025-06-21 01:00:00',
            });
        expect(res.status).toBe(400);
    });

    it('deve aceitar dataAtualizado exatamente em 01/01/2000', async () => {
        const produto = {
            nome: uniqueProductName('dataLimiteInf'),
            descricao: 'Produto com data limite inferior',
            preco: 50.00,
            dataAtualizado: '2000-01-01 00:00:00',
        };
        createdProductNames.push(produto.nome);
        const res = await request(app)
            .post('/produtos')
            .send(produto);
        expect(res.status).toBe(201);
        expect(res.body.nome).toBe(produto.nome);
        const id = res.body.id || res.body.result?.insertId;
        if (id) {
            createdProductIds.push(id);
        }
    });

    it('deve aceitar dataAtualizado exatamente em 20/06/2025', async () => {
        const produto = {
            nome: uniqueProductName('dataLimiteSup'),
            descricao: 'Produto com data limite superior',
            preco: 50.00,
            dataAtualizado: '2025-06-20 23:59:59',
        };
        createdProductNames.push(produto.nome);
        const res = await request(app)
            .post('/produtos')
            .send(produto);
        expect(res.status).toBe(201);
        expect(res.body.nome).toBe(produto.nome);
        const id = res.body.id || res.body.result?.insertId;
        if (id) {
            createdProductIds.push(id);
        }
    });

    // Testes de acesso público
    it('deve permitir GET /produtos sem autenticação', async () => {
        const res = await request(app)
            .get('/produtos');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('deve permitir POST /produtos sem autenticação', async () => {
        const produto = {
            nome: uniqueProductName('publico'),
            descricao: 'Produto criado sem autenticação',
            preco: 25.00,
        };
        createdProductNames.push(produto.nome);
        const res = await request(app)
            .post('/produtos')
            .send(produto);
        expect(res.status).toBe(201);
        expect(res.body.nome).toBe(produto.nome);
        const id = res.body.id || res.body.result?.insertId;
        if (id) {
            createdProductIds.push(id);
        }
    });

    it('deve permitir PUT /produtos sem autenticação', async () => {
        // Primeiro cria um produto
        const produto = {
            nome: uniqueProductName('put'),
            descricao: 'Produto para atualizar',
            preco: 30.00,
        };
        createdProductNames.push(produto.nome);
        const createRes = await request(app)
            .post('/produtos')
            .send(produto);
        const id = createRes.body.id || createRes.body.result?.insertId;
        if (id) {
            createdProductIds.push(id);
        }
        // Depois atualiza
        const updateRes = await request(app)
            .put(`/produtos/${id}`)
            .send({ ...produto, nome: produto.nome + '_atualizado' });
        expect(updateRes.status).toBe(201);
        expect(updateRes.body.message).toMatch(/atualizado/i);
    });

    it('deve permitir DELETE /produtos sem autenticação', async () => {
        // Primeiro cria um produto
        const produto = {
            nome: uniqueProductName('delete'),
            descricao: 'Produto que será deletado',
            preco: 40.00,
        };
        createdProductNames.push(produto.nome);
        const createRes = await request(app)
            .post('/produtos')
            .send(produto);
        const id = createRes.body.id || createRes.body.result?.insertId;
        if (id) {
            createdProductIds.push(id);
        }
        // Depois deleta
        const deleteRes = await request(app)
            .delete(`/produtos/${id}`);
        expect(deleteRes.status).toBe(201);
        expect(deleteRes.body.message).toMatch(/deletado/i);
    });

    // Testes de CRUD completo
    it('deve fazer CRUD completo de produto', async () => {
        // CREATE
        const novoProduto = {
            nome: uniqueProductName('crud'),
            descricao: 'Produto para teste completo',
            preco: 75.50,
        };
        createdProductNames.push(novoProduto.nome);
        const createRes = await request(app)
            .post('/produtos')
            .send(novoProduto);
        expect(createRes.status).toBe(201);
        expect(createRes.body.nome).toBe(novoProduto.nome);
        const id = createRes.body.id || createRes.body.result?.insertId;
        if (id) {
            createdProductIds.push(id);
        }
        // READ
        const readRes = await request(app)
            .get('/produtos');
        expect(readRes.status).toBe(200);
        expect(Array.isArray(readRes.body)).toBe(true);
        expect(readRes.body.some((p) => p.nome === novoProduto.nome))
            .toBe(true);
        // UPDATE
        const updateRes = await request(app)
            .put(`/produtos/${id}`)
            .send({ ...novoProduto, nome: novoProduto.nome + '_atualizado' });
        expect(updateRes.status).toBe(201);
        expect(updateRes.body.message).toMatch(/atualizado/i);
        // DELETE
        const deleteRes = await request(app).delete(`/produtos/${id}`);
        expect(deleteRes.status).toBe(201);
        expect(deleteRes.body.message).toMatch(/deletado/i);
    });
});
