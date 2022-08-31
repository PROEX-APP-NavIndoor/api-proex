import request from 'supertest';
import { getConnection, getCustomRepository } from 'typeorm';
import { app } from '../../app';
import createConnetion from '../../database';
import { IOrganization } from '../../interfaces/IOrganization.interface';
import { OrganizationRepository } from '../../repositories/OrganizationRepository';
import { yupConfig } from '../../validators/YupConfig'

// id inexistente
const idInexist = 'bf918fbb-94a9-4dd5-9db1-85ce524ed306';

const createOrganization : IOrganization = {
  name: 'Organização Tal',
  cep: '37510-000',
  state: 'Minas Gerais',
  district: 'District 1',
  city: 'São José do Alegre',
  street: 'Rua Tal',
  number: 125,
  description: 'Descrição Tal',
};

const editedOrganization : IOrganization = {
  name: 'Organização editada',
  cep: '37500-002',
  state: 'Minas Gerais',
  district: 'District 1',
  city: 'Itajubá',
  street: 'Rua Tal',
  number: 100,
  description: 'Descrição Tal Editada',
};

// usuário criado na execução dos seeders
const loginUser = {
  email: 'user1@gmail.com',
  password: '123456',
};

let token: string;
let organizationId: string;

describe('Organizations', () => {
  beforeAll(async () => {
    await createConnetion();
    const response = await request(app).post('/login').send(loginUser);
    token = response.body.token;
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.close();
  });

  // testes para criação de organização
  it('Should be able to create a new organization and return 201', async () => {
    const response = await request(app)
      .post('/organizations')
      .set('Authorization', `bearer ${token}`)
      .send(createOrganization);

    organizationId = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(createOrganization.name);
    expect(response.body.cep).toBe(createOrganization.cep);
    expect(response.body.state).toBe(createOrganization.state);
    expect(response.body.district).toBe(createOrganization.district);
    expect(response.body.city).toBe(createOrganization.city);
    expect(response.body.street).toBe(createOrganization.street);
    expect(response.body.number).toBe(createOrganization.number);
    expect(response.body.description).toBe(createOrganization.description);
  });

  it('Should returns 400 beacause there is no organization name', async () => {
    const response = await request(app)
      .post('/organizations')
      .set('Authorization', `bearer ${token}`)
      .send({
        cep: '37510-000',
        state: 'Minas Gerais',
        district: 'District 1',
        city: 'São José do Alegre',
        street: 'Rua Tal',
        number: 125,
        description: 'Descrição Tal',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('name').mixed.required);
  });

  it('Should returns 400 beacause there is no organization cep', async () => {
    const response = await request(app)
      .post('/organizations')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Organização Tal',
        state: 'Minas Gerais',
        district: 'District 1',
        city: 'São José do Alegre',
        street: 'Rua Tal',
        number: 125,
        description: 'Descrição Tal',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('cep').mixed.required);
  });

  it('Should returns 400 beacause there is no organization state', async () => {
    const response = await request(app)
      .post('/organizations')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Organização Tal',
        cep: '37510-000',
        district: 'District 1',
        city: 'São José do Alegre',
        street: 'Rua Tal',
        number: 125,
        description: 'Descrição Tal',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('state').mixed.required);
  });

  it('Should returns 400 beacause there is no organization district', async () => {
    const response = await request(app)
      .post('/organizations')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Organização Tal',
        cep: '37510-000',
        state: 'Minas Gerais',
        city: 'São José do Alegre',
        street: 'Rua Tal',
        number: 125,
        description: 'Descrição Tal',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('district').mixed.required);
  });

  it('Should returns 400 beacause there is no organization city', async () => {
    const response = await request(app)
      .post('/organizations')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Organização Tal',
        cep: '37510-000',
        state: 'Minas Gerais',
        district: 'District 1',
        street: 'Rua Tal',
        number: 125,
        description: 'Descrição Tal',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('city').mixed.required);
  });

  it('Should returns 400 beacause there is no organization street', async () => {
    const response = await request(app)
      .post('/organizations')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Organização Tal',
        cep: '37510-000',
        state: 'Minas Gerais',
        district: 'District 1',
        city: 'São José do Alegre',
        number: 125,
        description: 'Descrição Tal',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('street').mixed.required);
  });

  it('Should returns 400 beacause there is no organization number', async () => {
    const response = await request(app)
      .post('/organizations')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Organização Tal',
        cep: '37510-000',
        state: 'Minas Gerais',
        district: 'District 1',
        city: 'São José do Alegre',
        street: 'Rua Tal',
        description: 'Descrição Tal',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('number').mixed.required);
  });

  it('Should returns 400 beacause there is no organization description', async () => {
    const response = await request(app)
      .post('/organizations')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Organização Tal',
        cep: '37510-000',
        state: 'Minas Gerais',
        district: 'District 1',
        city: 'São José do Alegre',
        street: 'Rua Tal',
        number: 125,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('description').mixed.required);
  });

  it('Should not be able to create a organization which exists and return 400', async () => {
    const response = await request(app)
      .post('/organizations')
      .set('Authorization', `bearer ${token}`)
      .send(createOrganization);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Organização já existe');
  });

  // testes para atualização de organização
  it('Should be able to edit a existing organization and return 200', async () => {
    const response = await request(app)
      .put(`/organizations/${organizationId}`)
      .set('Authorization', `bearer ${token}`)
      .send(editedOrganization);

    const repository = getCustomRepository(OrganizationRepository);
    const organizationUpdated = await repository.findOne({ id: organizationId });

    expect(response.status).toBe(200);
    expect(editedOrganization.name).toBe(organizationUpdated.name);
    expect(editedOrganization.cep).toBe(organizationUpdated.cep);
    expect(editedOrganization.state).toBe(organizationUpdated.state);
    expect(editedOrganization.district).toBe(organizationUpdated.district);
    expect(editedOrganization.city).toBe(organizationUpdated.city);
    expect(editedOrganization.street).toBe(organizationUpdated.street);
    expect(editedOrganization.number).toBe(organizationUpdated.number);
    expect(editedOrganization.description).toBe(organizationUpdated.description);
    expect(response.body.message).toBe('Organização atualizada com sucesso!');
  });

  it('Should return 400 when update organization by invalid type id', async () => {
    const response = await request(app)
      .put(`/organizations/2`)
      .set('Authorization', `bearer ${token}`)
      .send(editedOrganization);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('id').string.uuid);
  });

  it('Should return 404 for update missing id organization', async () => {
    const response = await request(app)
      .put(`/organizations/${idInexist}`)
      .set('Authorization', `bearer ${token}`)
      .send(editedOrganization);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Organização não existe!');
  });

  // testes para visualização de organização por id
  it('Should be able to get a organization by Id and return 200', async () => {
    const response = await request(app)
      .get(`/organizations/${organizationId}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(editedOrganization.name);
    expect(response.body.cep).toBe(editedOrganization.cep);
    expect(response.body.state).toBe(editedOrganization.state);
    expect(response.body.district).toBe(editedOrganization.district);
    expect(response.body.city).toBe(editedOrganization.city);
    expect(response.body.street).toBe(editedOrganization.street);
    expect(response.body.number).toBe(editedOrganization.number);
    expect(response.body.description).toBe(editedOrganization.description);
  });

  it('Should return 404 for searching missing id organization', async () => {
    const response = await request(app)
      .get(`/organizations/${idInexist}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Organização não existe!');
  });

  it('Should return 400 when searching organization by invalid type id', async () => {
    const response = await request(app)
      .get(`/organizations/2`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('id').string.uuid);
  });

  // teste para visualização de todas as organizações
  it('Should be able to get all organizations and return 200', async () => {
    const response = await request(app)
      .get('/organizations')
      .set('Authorization', `bearer ${token}`);

    const repository = getCustomRepository(OrganizationRepository);
    const allOrganizations = await repository.find();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(allOrganizations.length);
  });

  // testes para deleção de organização
  it('Should be able to delete a organization and return 200', async () => {
    const response = await request(app)
      .delete(`/organizations/${organizationId}`)
      .set('Authorization', `bearer ${token}`);

    const repository = getCustomRepository(OrganizationRepository);
    const deleted = await repository.findOne({ id: organizationId });

    expect(response.status).toBe(200);
    expect(deleted).toBeUndefined();
    expect(response.body.message).toBe('Organização removida com sucesso!');
  });

  it('Should return 400 when delete organization by invalid type id', async () => {
    const response = await request(app)
      .delete(`/organizations/2`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('id').string.uuid);
  });

  it('Should return 404 for delete missing id organization', async () => {
    const response = await request(app)
      .delete(`/organizations/${idInexist}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Organização não existe!');
  });
});
