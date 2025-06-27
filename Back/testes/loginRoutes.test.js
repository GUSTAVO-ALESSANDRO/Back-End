const request = require('supertest');
const app = require('../app');

describe('Testes para rotas de login', () => {
    let adminToken;

    beforeAll(async () => {
        // Cria um usuário admin para os testes
        try {
            await request(app)
                .post('/usuarios')
                .send({ usuario: 'admin', senha: 'admin123' });
        } catch (error) {
            // Usuário já existe, continua
        }
    });

    it('deve fazer login com credenciais válidas', async () => {
        const res = await request(app)
            .post('/login')
            .send({ usuario: 'admin', senha: 'admin123' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('auth', true);
        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string');
        adminToken = res.body.token;
    });

    it('deve rejeitar login com usuário inexistente', async () => {
        const res = await request(app)
            .post('/login')
            .send({ usuario: 'usuarioinexistente', senha: 'senha123' });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('deve rejeitar login com senha incorreta', async () => {
        const res = await request(app)
            .post('/login')
            .send({ usuario: 'admin', senha: 'senhaincorreta' });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('deve rejeitar login sem usuário', async () => {
        const res = await request(app)
            .post('/login')
            .send({ senha: 'senha123' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    it('deve rejeitar login sem senha', async () => {
        const res = await request(app)
            .post('/login')
            .send({ usuario: 'admin' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    it('deve rejeitar login sem dados', async () => {
        const res = await request(app)
            .post('/login')
            .send({});
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    it('deve rejeitar login com dados vazios', async () => {
        const res = await request(app)
            .post('/login')
            .send({ usuario: '', senha: '' });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
    });

    it('deve permitir acesso a rota protegida com token válido', async () => {
        if (!adminToken) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const res = await request(app)
            .get('/clientes')
            .set('authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
    });

    it('deve rejeitar acesso a rota protegida com token inválido', async () => {
        const res = await request(app)
            .get('/clientes')
            .set('authorization', 'Bearer tokeninvalido');
        expect(res.status).toBe(401);
    });

    it('deve rejeitar acesso a rota protegida sem token', async () => {
        const res = await request(app)
            .get('/clientes');
        expect(res.status).toBe(401);
    });

    it('deve fazer logout com token válido', async () => {
        if (!adminToken) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const res = await request(app)
            .post('/logout')
            .set('authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('mensagem');
    });

    it('deve invalidar token após logout', async () => {
        if (!adminToken) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        // Faz logout
        await request(app)
            .post('/logout')
            .set('authorization', `Bearer ${adminToken}`);

        // Tenta acessar rota protegida com token invalidado
        const res = await request(app)
            .get('/clientes')
            .set('authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(401);
    });

    it('deve gerar novo token após logout e novo login', async () => {
        // Faz novo login para obter token fresco
        const loginRes = await request(app)
            .post('/login')
            .send({ usuario: 'admin', senha: 'admin123' });
        expect(loginRes.status).toBe(200);
        const freshToken = loginRes.body.token;

        // Verifica se o novo token funciona
        const res = await request(app)
            .get('/clientes')
            .set('authorization', `Bearer ${freshToken}`);
        expect(res.status).toBe(200);
    });
});
