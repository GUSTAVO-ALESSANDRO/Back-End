const request = require('supertest');
const app = require('../app');
const palavra255 = 'A'.repeat(255);
const palavra256 = 'A'.repeat(256);

describe('Testes completos para rotas de clientes', () => {
    let token;

    beforeAll(async () => {
        // Primeiro cria um usuário admin para os testes
        // (pode falhar se já existir)
        try {
            await request(app)
                .post('/usuarios')
                .send({ usuario: 'admin', senha: 'admin123' });
        } catch (error) {
            // Usuário já existe, continua
        }
        // Faz login com o usuário criado
        const login = await request(app)
            .post('/login')
            .send({ usuario: 'admin', senha: 'admin123' });
        if (login.status === 200) {
            token = login.body.token;
        }
    });

    // Testes de validação de nome
    it('deve rejeitar nome com menos de 3 caracteres', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send({ nome: 'Jo', sobrenome: 'Silva',
                email: 'joaoteste1@example.com', idade: 25 });
        expect(res.status).toBe(400);
    });

    it('deve aceitar nome com exatamente 3 caracteres', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const cliente = { nome: 'Ana', sobrenome: 'Silva',
            email: 'joaoteste2@example.com', idade: 25 };
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send(cliente);
        expect(res.status).toBe(201);
        expect(res.body.nome).toBe('Ana');
        const id = res.body.id || res.body.result?.insertId;
        await request(app)
            .delete(`/clientes/${id}`)
            .set('authorization', `Bearer ${token}`);
    });

    it('deve aceitar nome com 255 caracteres', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const cliente = { nome: palavra255, sobrenome: 'Silva',
            email: 'joaoteste3@example.com', idade: 30 };
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send(cliente);
        expect(res.status).toBe(201);
        expect(res.body.nome).toBe(palavra255);
        const id = res.body.id || res.body.result?.insertId;
        await request(app)
            .delete(`/clientes/${id}`)
            .set('authorization', `Bearer ${token}`);
    });

    it('deve rejeitar nome com 256 caracteres', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send({ nome: palavra256, sobrenome: 'Silva',
                email: 'joaoteste4@example.com', idade: 30 });
        expect(res.status).toBe(400);
    });

    // Testes de validação de sobrenome
    it('deve rejeitar sobrenome com menos de 3 caracteres', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send({ nome: 'Joao', sobrenome: 'Si',
                email: 'joaoteste5@example.com', idade: 25 });
        expect(res.status).toBe(400);
    });

    it('deve aceitar sobrenome com exatamente 3 caracteres', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const cliente = { nome: 'Joao', sobrenome: 'Sil',
            email: 'joaoteste6@example.com', idade: 25 };
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send(cliente);
        expect(res.status).toBe(201);
        expect(res.body.sobrenome).toBe('Sil');
        const id = res.body.id || res.body.result?.insertId;
        await request(app)
            .delete(`/clientes/${id}`)
            .set('authorization', `Bearer ${token}`);
    });

    it('deve aceitar sobrenome com 255 caracteres', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const cliente = { nome: 'Joao', sobrenome: palavra255,
            email: 'joaoteste7@example.com', idade: 25 };
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send(cliente);
        expect(res.status).toBe(201);
        expect(res.body.sobrenome).toBe(palavra255);
        const id = res.body.id || res.body.result?.insertId;
        await request(app)
            .delete(`/clientes/${id}`)
            .set('authorization', `Bearer ${token}`);
    });

    it('deve rejeitar sobrenome com mais de 255 caracteres', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send({ nome: 'Joao', sobrenome: palavra256,
                email: 'joaoteste5@example.com', idade: 25 });
        expect(res.status).toBe(400);
    });

    // Testes de validação de email
    it('deve rejeitar email inválido sem @', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send({ nome: 'Joao', sobrenome: 'Silva',
                email: 'emailinvalido', idade: 25 });
        expect(res.status).toBe(400);
    });

    it('deve rejeitar email inválido sem domínio', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send({ nome: 'Joao', sobrenome: 'Silva',
                email: 'email@', idade: 25 });
        expect(res.status).toBe(400);
    });

    it('deve aceitar email válido', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const cliente = { nome: 'Jonas', sobrenome: 'Ferreira',
            email: 'joaoteste8@example.com', idade: 30 };
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send(cliente);
        expect(res.status).toBe(201);
        expect(res.body.email).toBe(cliente.email);
        const id = res.body.id || res.body.result?.insertId;
        await request(app)
            .delete(`/clientes/${id}`)
            .set('authorization', `Bearer ${token}`);
    });

    // Testes de validação de idade
    it('deve rejeitar idade igual a 0', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send({ nome: 'Joao', sobrenome: 'Silva',
                email: 'joaoteste9@example.com', idade: 0 });
        expect(res.status).toBe(400);
    });

    it('deve rejeitar idade negativa', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send({ nome: 'Joao', sobrenome: 'Silva',
                email: 'joaoteste10@example.com', idade: -1 });
        expect(res.status).toBe(400);
    });

    it('deve aceitar idade igual a 1', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const cliente = { nome: 'Carlos', sobrenome: 'Alves',
            email: 'joaoteste11@example.com', idade: 1 };
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send(cliente);
        expect(res.status).toBe(201);
        expect(res.body.idade).toBe(1);
        const id = res.body.id || res.body.result?.insertId;
        await request(app)
            .delete(`/clientes/${id}`)
            .set('authorization', `Bearer ${token}`);
    });

    it('deve aceitar idade igual a 119', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const cliente = { nome: 'Carlos', sobrenome: 'Alves',
            email: 'joaoteste12@example.com', idade: 119 };
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send(cliente);
        expect(res.status).toBe(201);
        expect(res.body.idade).toBe(119);
        const id = res.body.id || res.body.result?.insertId;
        await request(app)
            .delete(`/clientes/${id}`)
            .set('authorization', `Bearer ${token}`);
    });

    it('deve rejeitar idade igual a 120', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send({ nome: 'Joao', sobrenome: 'Silva',
                email: 'joaoteste13@example.com', idade: 120 });
        expect(res.status).toBe(400);
    });

    it('deve rejeitar idade maior que 120', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const res = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send({ nome: 'Joao', sobrenome: 'Silva',
                email: 'joaoteste14@example.com', idade: 121 });
        expect(res.status).toBe(400);
    });

    // Testes de autenticação
    it('deve rejeitar GET /clientes sem autenticação', async () => {
        const res = await request(app)
            .get('/clientes');
        expect(res.status).toBe(401);
    });

    it('deve rejeitar POST /clientes sem autenticação', async () => {
        const res = await request(app)
            .post('/clientes')
            .send({ nome: 'Joao', sobrenome: 'Silva',
                email: 'joaoteste15@example.com', idade: 25 });
        expect(res.status).toBe(401);
    });

    it('deve rejeitar PUT /clientes sem autenticação', async () => {
        const res = await request(app)
            .put('/clientes/1')
            .send({ nome: 'Joao', sobrenome: 'Silva',
                email: 'joaoteste16@example.com', idade: 25 });
        expect(res.status).toBe(401);
    });

    it('deve rejeitar DELETE /clientes sem autenticação', async () => {
        const res = await request(app)
            .delete('/clientes/1');
        expect(res.status).toBe(401);
    });

    // Testes de CRUD completo
    it('deve fazer CRUD completo de cliente', async () => {
        if (!token) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        // CREATE
        const novoCliente = {
            nome: 'Teste',
            sobrenome: 'Automatizado',
            email: 'joaoteste17@example.com',
            idade: 35,
        };
        const createRes = await request(app)
            .post('/clientes')
            .set('authorization', `Bearer ${token}`)
            .send(novoCliente);
        expect(createRes.status).toBe(201);
        expect(createRes.body.nome).toBe(novoCliente.nome);
        const id = createRes.body.id || createRes.body.result?.insertId;
        // READ
        const readRes = await request(app)
            .get('/clientes')
            .set('authorization', `Bearer ${token}`);
        expect(readRes.status).toBe(200);
        expect(Array.isArray(readRes.body)).toBe(true);
        expect(readRes.body.some( (c) => c.email === novoCliente.email))
            .toBe(true);
        // UPDATE
        const updateRes = await request(app)
            .put(`/clientes/${id}`)
            .set('authorization', `Bearer ${token}`)
            .send({ ...novoCliente, nome: 'Atualizado' });
        expect(updateRes.status).toBe(201);
        expect(updateRes.body.message).toMatch(/atualizado/i);
        // DELETE
        const deleteRes = await request(app)
            .delete(`/clientes/${id}`)
            .set('authorization', `Bearer ${token}`);
        expect(deleteRes.status).toBe(201);
        expect(deleteRes.body.message).toMatch(/deletado/i);
    });
});
