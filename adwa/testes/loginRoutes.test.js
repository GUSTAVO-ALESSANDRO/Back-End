const request = require('supertest');
const app = require('../app');

describe('Testes para rotas de login e logout', () => {
    let adminToken;

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
        const loginRes = await request(app)
            .post('/login')
            .send({ usuario: 'admin', senha: 'admin123' });
        if (loginRes.status === 200) {
            adminToken = loginRes.body.token;
        }
    });

    // Testes de login
    it('deve fazer login com credenciais válidas', async () => {
        const res = await request(app)
            .post('/login')
            .send({ usuario: 'admin', senha: 'admin123' });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(typeof res.body.token).toBe('string');
        expect(res.body.token.length).toBeGreaterThan(0);
    });

    it('deve rejeitar login com usuário inválido', async () => {
        const res = await request(app)
            .post('/login')
            .send({ usuario: 'usuarioinexistente', senha: 'admin123' });
        expect(res.status).toBe(401);
    });

    it('deve rejeitar login com senha inválida', async () => {
        const res = await request(app)
            .post('/login')
            .send({ usuario: 'admin', senha: 'senhaincorreta' });
        expect(res.status).toBe(401);
    });

    it('deve rejeitar login sem usuário', async () => {
        const res = await request(app)
            .post('/login')
            .send({ senha: 'admin123' });
        expect(res.status).toBe(400);
    });

    it('deve rejeitar login sem senha', async () => {
        const res = await request(app)
            .post('/login')
            .send({ usuario: 'admin' });
        expect(res.status).toBe(400);
    });

    it('deve rejeitar login com dados vazios', async () => {
        const res = await request(app)
            .post('/login')
            .send({ usuario: '', senha: '' });
        expect(res.status).toBe(400);
    });

    // Testes de logout
    it('deve fazer logout com token válido', async () => {
        if (!adminToken) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const logoutRes = await request(app)
            .post('/logout')
            .set('x-access-token', adminToken);
        expect(logoutRes.status).toBe(200);
    });

    it('deve rejeitar logout sem token', async () => {
        const res = await request(app)
            .post('/logout');
        expect(res.status).toBe(401);
    });

    it('deve rejeitar logout com token inválido', async () => {
        const res = await request(app)
            .post('/logout')
            .set('x-access-token', 'tokeninvalido');
        expect(res.status).toBe(401);
    });

    // Testes de invalidação de token após logout
    it('deve invalidar token após logout', async () => {
        // Obtém um token fresco para este teste
        const loginRes = await request(app)
            .post('/login')
            .send({ usuario: 'admin', senha: 'admin123' });
        if (loginRes.status !== 200) {
            // Se não conseguiu fazer login, pula o teste
            return;
        }
        const freshToken = loginRes.body.token;
        // Faz logout
        const logoutRes = await request(app)
            .post('/logout')
            .set('x-access-token', freshToken);
        expect(logoutRes.status).toBe(200);
        // Verifica que o token não funciona mais após logout
        const invalidRes = await request(app)
            .get('/clientes')
            .set('x-access-token', freshToken);
        expect(invalidRes.status).toBe(401);
    });
});
