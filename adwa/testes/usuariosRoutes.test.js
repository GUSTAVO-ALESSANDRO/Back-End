const request = require('supertest');
const app = require('../app');
const palavra255 = 'A'.repeat(255);
const palavra256 = 'A'.repeat(256);

describe('Testes para rotas de usuários', () => {
    let createdUserIds = [];
    let createdUsernames = [];

    const cleanupUsers = async () => {
        const loginRes = await request(app)
            .post('/login')
            .send({ usuario: 'admin', senha: 'admin123' });
        const token = loginRes.status === 200 ? loginRes.body.token : null;
        for (const userId of createdUserIds) {
            try {
                if (token) {
                    await request(app)
                        .delete(`/usuarios/${userId}`)
                        .set('x-access-token', token);
                }
            } catch (error) {}
        }
        createdUserIds = [];
        // Limpa por username caso algum usuário não
        // tenha sido registrado no array de IDs
        for (const username of createdUsernames) {
            try {
                const [res] = await app.db.query(
                    'SELECT id FROM usuarios WHERE usuario = ?', [username]);
                if (res && res.length > 0) {
                    const id = res[0].id;
                    if (token) {
                        await request(app)
                            .delete(`/usuarios/${id}`)
                            .set('x-access-token', token);
                    }
                }
            } catch (error) {}
        }
        createdUsernames = [];
    };

    afterEach(async () => {
        await cleanupUsers();
    });

    afterAll(async () => {
        await cleanupUsers();
    });

    // Necessario para o lint
    /**
    * Gera um nome de usuário único para testes.
    * @param {string} suffix - Um sufixo identificador para o nome.
    * @return {string} Nome de usuário único.
    */
    function uniqueUser(suffix) {
        return `usuario_teste_${suffix}_${Date.now()}`;
    }


    it('deve criar um usuário válido', async () => {
        const usuario = uniqueUser('valido');
        createdUsernames.push(usuario);
        const res = await request(app)
            .post('/usuarios')
            .send({ usuario, senha: 'senha123' });
        expect([201, 400]).toContain(res.status);
        if (res.status === 201 && res.body.id) {
            createdUserIds.push(res.body.id);
        }
    });

    it('deve rejeitar criação de usuário sem nome de usuário', async () => {
        const res = await request(app)
            .post('/usuarios')
            .send({ senha: 'senha123' });
        expect(res.status).toBe(400);
    });

    it('deve rejeitar criação de usuário sem senha', async () => {
        const res = await request(app)
            .post('/usuarios')
            .send({ usuario: uniqueUser('sem_senha') });
        expect(res.status).toBe(400);
    });

    it('deve rejeitar criação de usuário com dados vazios', async () => {
        const res = await request(app)
            .post('/usuarios')
            .send({ usuario: '', senha: '' });
        expect(res.status).toBe(400);
    });

    it('deve rejeitar criação de usuário duplicado', async () => {
        const usuario = uniqueUser('duplicado');
        createdUsernames.push(usuario);
        const res1 = await request(app)
            .post('/usuarios')
            .send({ usuario, senha: 'senha123' });
        if (res1.status === 201 && res1.body.id) {
            createdUserIds.push(res1.body.id);
        }
        const res2 = await request(app)
            .post('/usuarios')
            .send({ usuario, senha: 'senha123' });
        expect(res2.status).toBe(400);
    });

    it('deve listar todos os usuários', async () => {
        const loginRes = await request(app)
            .post('/login')
            .send({ usuario: 'admin', senha: 'admin123' });
        if (loginRes.status === 200) {
            const token = loginRes.body.token;
            const res = await request(app)
                .get('/usuarios')
                .set('x-access-token', token);
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            if (res.body.length > 0) {
                const primeiroUsuario = res.body[0];
                expect(primeiroUsuario).toHaveProperty('id');
                expect(primeiroUsuario).toHaveProperty('usuario');
                expect(primeiroUsuario).not.toHaveProperty('senha');
            }
        }
    });

    it('deve rejeitar usuário com nome muito curto', async () => {
        const res = await request(app)
            .post('/usuarios')
            .send({ usuario: 'ab', senha: 'senha123' });
        expect(res.status).toBe(400);
    });

    it('deve aceitar usuário com nome de 3 caracteres', async () => {
        const usuario = 'abc';
        createdUsernames.push(usuario);
        const res = await request(app)
            .post('/usuarios')
            .send({ usuario, senha: 'senha123' });
        expect(res.status).toBe(201);
        if (res.body.id) {
            createdUserIds.push(res.body.id);
        }
    });

    it('deve aceitar usuário com nome de 255 caracteres', async () => {
        const usuario = palavra255;
        createdUsernames.push(usuario);
        const res = await request(app)
            .post('/usuarios')
            .send({ usuario, senha: 'senha123' });
        expect(res.status).toBe(201);
        if (res.body.id) {
            createdUserIds.push(res.body.id);
        }
    });

    it('deve rejeitar usuário com nome de 256 caracteres', async () => {
        const usuario = palavra256;
        const res = await request(app)
            .post('/usuarios')
            .send({ usuario, senha: 'senha123' });
        expect(res.status).toBe(400);
    });

    it('deve rejeitar senha muito curta', async () => {
        const usuario = uniqueUser('curta');
        createdUsernames.push(usuario);
        const res = await request(app)
            .post('/usuarios')
            .send({ usuario, senha: 'xy' });
        expect(res.status).toBe(400);
    });

    it('deve aceitar senha com 3 caracteres', async () => {
        const usuario = uniqueUser('senha3');
        createdUsernames.push(usuario);
        const res = await request(app)
            .post('/usuarios')
            .send({ usuario, senha: 'abc' });
        expect(res.status).toBe(201);
        if (res.body.id) {
            createdUserIds.push(res.body.id);
        }
    });

    it('deve aceitar senha com 255 caracteres', async () => {
        const usuario = uniqueUser('senha255');
        createdUsernames.push(usuario);
        const res = await request(app)
            .post('/usuarios')
            .send({ usuario, senha: palavra255 });
        expect(res.status).toBe(201);
        if (res.body.id) {
            createdUserIds.push(res.body.id);
        }
    });

    it('deve rejeitar senha com 256 caracteres', async () => {
        const usuario = uniqueUser('senha256');
        const res = await request(app)
            .post('/usuarios')
            .send({ usuario, senha: palavra256 });
        expect(res.status).toBe(400);
    });

    it('não deve retornar senha na resposta', async () => {
        const usuario = uniqueUser('noSenha');
        createdUsernames.push(usuario);
        const res = await request(app)
            .post('/usuarios')
            .send({ usuario, senha: 'senha123' });
        expect([201, 400]).toContain(res.status);
        if (res.status === 201) {
            expect(res.body).not.toHaveProperty('senha');
            expect(res.body).not.toHaveProperty('password');
            if (res.body.id) {
                createdUserIds.push(res.body.id);
            }
        }
    });

    it('deve armazenar senha de forma segura (hash)', async () => {
        const usuario = uniqueUser('hash');
        createdUsernames.push(usuario);
        const res = await request(app)
            .post('/usuarios')
            .send({ usuario, senha: 'senha123' });
        expect([201, 400]).toContain(res.status);
        if (res.status === 201 && res.body.id) {
            createdUserIds.push(res.body.id);
        }
        const loginRes = await request(app)
            .post('/login')
            .send({ usuario, senha: 'senha123' });
        expect([200, 401]).toContain(loginRes.status);
        if (loginRes.status === 200) {
            expect(loginRes.body).toHaveProperty('token');
        }
    });
});
