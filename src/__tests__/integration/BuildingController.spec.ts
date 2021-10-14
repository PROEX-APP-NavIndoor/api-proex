/* eslint-disable no-undef */
import httpStatus from 'http-status';
import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../../app';
import createConnetion from '../../database';

const createBuilding = {
  name: 'Prédio 1',
  latitude: -25.3347773,
  longitude: -47.5304414,
  description: 'Descrição do prédio 1',
  organization_id: '',
};

const createOrganization = {
  name: 'Organização Tal',
  cep: '37510-000',
  state: 'Minas Gerais',
  district: 'District 1',
  city: 'São José do Alegre',
  street: 'Rua Tal',
  number: 125,
  description: 'Descrição Tal',
};

const createUser = {
  name: 'User example',
  email: 'user@example.com',
  password: '123456',
  role: 'SUPER',
};

const loginUser = {
  email: createUser.email,
  password: createUser.password,
};

let token: string;
let buildingId: string;
let organization_id: string;

describe('Buildings', () => {
  beforeAll(async () => {
    await createConnetion();
    // to create a new user
    await request(app).post('/users').send(createUser);
    const Login = await request(app).post('/login').send(loginUser);
    token = Login.body.token;

    const newOrganization = await request(app)
      .post('/organizations')
      .set('Authorization', `bearer ${token}`)
      .send(createOrganization);

    organization_id = newOrganization.body.id;
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.close();
  });

  it('Should be able to create a new building', async () => {
    createBuilding.organization_id = organization_id;

    const response = await request(app)
      .post('/buildings')
      .set('Authorization', `bearer ${token}`)
      .send(createBuilding);

    buildingId = response.body.id;

    expect(response.status).toBe(httpStatus.CREATED);
    expect(response.body.name).toBe(createBuilding.name);
    expect(response.body.latitude).toBe(createBuilding.latitude);
    expect(response.body.longitude).toBe(createBuilding.longitude);
    expect(response.body.organization_id).toBe(createBuilding.organization_id);
  });

  it('Should not be able to create a building with exists', async () => {
    const response = await request(app)
      .post('/buildings')
      .set('Authorization', `bearer ${token}`)
      .send(createBuilding);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.body.message).toBe('Prédio já existe');
  });

  it('Should be able to edit a existing building', async () => {
    const editedBuilding = {
      name: 'Prédio 1 editado',
      latitude: -25.3347773,
      longitude: -47.5304414,
      description: 'Descrição do prédio 1',
      organization_id,
    };

    const response = await request(app)
      .put(`/buildings/${buildingId}`)
      .set('Authorization', `bearer ${token}`)
      .send(editedBuilding);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.message).toBe('Prédio atualizado com sucesso!');
  });

  it('Should be able to get a building by Id', async () => {
    const response = await request(app)
      .get(`/buildings/${buildingId}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.name).toBe('Prédio 1 editado');
  });

  it('Should not be able to get a building by Id', async () => {
    const response = await request(app).get(`/buildings/2`).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
    expect(response.body.message).toBe('Id do prédio não encontrado');
  });

  it('Should be able to get all buildings', async () => {
    const response = await request(app).get('/buildings').set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body[0].name).toBe('Prédio 1 editado');
  });

  it('Should be able to delete a building', async () => {
    const response = await request(app)
      .delete(`/buildings/${buildingId}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body.message).toBe('Prédio removido com sucesso!');
  });
});
