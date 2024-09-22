import request from 'supertest';
import app from '../index'; // Ajuste o caminho conforme sua estrutura de projeto
import Project from '../models/project.model';
import ProjetosUsuarios from '../models/projectUser.model';

describe('Project Routes', () => {

    beforeEach(async () => {
        // Limpar a coleção de projetos antes de cada teste
        await Project.deleteMany({});
        await ProjetosUsuarios.deleteMany({});
    });

    it('should create a project', async () => {
        const response = await request(app)
            .post('/api/projects')
            .send({
                nome: 'Projeto Teste',
                descricao: 'Descrição do projeto teste',
                data_inicio: new Date(),
                data_fim: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                status: 'Em andamento'
            });

        expect(response.status).toBe(200);
        expect(response.body.project.nome).toBe('Projeto Teste');
    });

    it('should get all projects', async () => {
        await Project.create({
            nome: 'Projeto 1',
            descricao: 'Descrição do projeto 1',
            data_inicio: new Date(),
            data_fim: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            status: 'Em andamento'
        });

        const response = await request(app).get('/api/projects');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].nome).toBe('Projeto 1');
    });

    it('should get a specific project', async () => {
        const project = await Project.create({
            nome: 'Projeto 1',
            descricao: 'Descrição do projeto 1',
            data_inicio: new Date(),
            data_fim: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            status: 'Em andamento'
        });

        const response = await request(app).get(`/api/projects/${project._id}`);

        expect(response.status).toBe(200);
        expect(response.body.nome).toBe('Projeto 1');
    });

    it('should update a project', async () => {
        const project = await Project.create({
            nome: 'Projeto 1',
            descricao: 'Descrição do projeto 1',
            data_inicio: new Date(),
            data_fim: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            status: 'Em andamento'
        });

        const response = await request(app)
            .put(`/api/projects/${project._id}`)
            .send({ status: 'Concluído' });

        expect(response.status).toBe(200);
        expect(response.body.project.status).toBe('Concluído');
    });

    it('should delete a project', async () => {
        const project = await Project.create({
            nome: 'Projeto 1',
            descricao: 'Descrição do projeto 1',
            data_inicio: new Date(),
            data_fim: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            status: 'Concluído'
        });

        const response = await request(app).delete(`/api/projects/${project._id}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Projeto deletado com sucesso! API');
    });


    it('should get projects by status count', async () => {
        await Project.create({
            nome: 'Projeto 1',
            descricao: 'Descrição do projeto 1',
            data_inicio: new Date(),
            data_fim: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            status: 'Concluído'
        });

        const response = await request(app).get('/api/projects/status-count');

        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should get projects paginated', async () => {
        await Project.create({
            nome: 'Projeto 1',
            descricao: 'Descrição do projeto 1',
            data_inicio: new Date(),
            data_fim: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            status: 'Em andamento'
        });

        const response = await request(app).get('/api/projects/paginated?page=1&limit=1');

        expect(response.status).toBe(200);
        expect(response.body.totalProjects).toBe(1);
        expect(response.body.currentPage).toBe(1);
    });

});
