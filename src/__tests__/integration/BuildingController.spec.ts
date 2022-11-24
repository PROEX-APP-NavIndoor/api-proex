import request from 'supertest';
import { getConnection, getCustomRepository } from 'typeorm';
import { app } from '../../app';
import createConnetion from '../../database';
import { IBuilding } from '../../interfaces/IBuilding.interface';
import { BuildingRepository } from '../../repositories/BuildingRepository';
import { yupConfig } from '../../validators/YupConfig'

// ids de organizações cadastradas no seeders
const organizationId1 = 'ad8fb4ff-a518-42c0-af78-ac5062eaf53d';
const organizationId2 = '45659fc4-1946-4080-adba-d084543c3324';

// id inexistente
const idInexist = 'bf918fbb-94a9-4dd5-9db1-85ce524ed306';

const createBuilding : IBuilding = {
  name: 'Prédio Test',
  latitude: -25.3347773,
  longitude: -47.5304414,
  description: 'Descrição do prédio Test',
  organization_id: organizationId1,
};

const editedBuilding : IBuilding = {
  name: 'Prédio Test editado',
  latitude: -26.3347773,
  longitude: -48.5304414,
  description: 'Descrição do prédio Test editado',
  organization_id: organizationId2,
};

const buildingInvalid : IBuilding = {
  name: 'Prédio Test 2',
  latitude: -25.3347779,
  longitude: -47.5304419,
  description: 'Descrição do prédio Test 2',
  organization_id: idInexist,
};

// usuário criado na execução dos seeders
const loginUser = {
  email: 'user1@gmail.com',
  password: '123456',
};

let token: string;
let buildingId: string;

describe('Buildings', () => {
  beforeAll(async () => {
    await createConnetion();
    const Login = await request(app).post('/login').send(loginUser);
    token = Login.body.token;
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.close();
  });

  // testes para criação de prédios
  it('Should be able to create a new building and return 201', async () => {
    const response = await request(app)
      .post('/buildings')
      .set('Authorization', `bearer ${token}`)
      .send(createBuilding);

    buildingId = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(createBuilding.name);
    expect(response.body.latitude).toBe(createBuilding.latitude);
    expect(response.body.longitude).toBe(createBuilding.longitude);
    expect(response.body.organization_id).toBe(createBuilding.organization_id);
  });

  it('Should returns 400 beacause there is no building name', async () => {
    const response = await request(app)
      .post('/buildings')
      .set('Authorization', `bearer ${token}`)
      .send({
        latitude: -25.3347773,
        longitude: -47.5304414,
        description: 'Descrição do prédio Test',
        organization_id: organizationId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('name').mixed.required);
  });

  it('Should returns 400 beacause there is no building latitude', async () => {
    const response = await request(app)
      .post('/buildings')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Prédio Test',
        longitude: -47.5304414,
        description: 'Descrição do prédio Test',
        organization_id: organizationId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('latitude').mixed.required);
  });

  it('Should returns 400 beacause there is no building longitude', async () => {
    const response = await request(app)
      .post('/buildings')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Prédio Test',
        latitude: -25.3347773,
        description: 'Descrição do prédio Test',
        organization_id: organizationId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('longitude').mixed.required);
  });

  it('Should returns 400 beacause there is no building description', async () => {
    const response = await request(app)
      .post('/buildings')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Prédio Test',
        latitude: -25.3347773,
        longitude: -47.5304414,
        organization_id: organizationId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('description').mixed.required);
  });

  it('Should returns 400 beacause there is no building organization_id', async () => {
    const response = await request(app)
      .post('/buildings')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Prédio Test',
        latitude: -25.3347773,
        longitude: -47.5304414,
        description: 'Descrição do prédio Test',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('organization_id').mixed.required);
  });

  it('Should not be able to create a building with exists and return 400', async () => {
    const response = await request(app)
      .post('/buildings')
      .set('Authorization', `bearer ${token}`)
      .send(createBuilding);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Prédio já existe');
  });

  it('Should return 404 because when registering building, organization_id does not exist in the database', async () => {
    const response = await request(app)
      .post('/buildings')
      .set('Authorization', `bearer ${token}`)
      .send(buildingInvalid);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Id de organização não existe');
  });

  // testes para edição de prédios
  it('Should be able to edit a existing building and return 200', async () => {
    const response = await request(app)
      .put(`/buildings/${buildingId}`)
      .set('Authorization', `bearer ${token}`)
      .send(editedBuilding);

    const repository = getCustomRepository(BuildingRepository);
    const buildingUpdated = await repository.findOne({ id: buildingId });

    expect(response.status).toBe(200);
    expect(buildingUpdated.name).toBe(editedBuilding.name);
    expect(buildingUpdated.latitude).toBe(editedBuilding.latitude);
    expect(buildingUpdated.longitude).toBe(editedBuilding.longitude);
    expect(buildingUpdated.description).toBe(editedBuilding.description);
    expect(buildingUpdated.organization_id).toBe(editedBuilding.organization_id);
    expect(response.body.message).toBe('Prédio atualizado com sucesso!');
  });

  it('Should return 400 when update building by invalid type id', async () => {
    const response = await request(app)
      .put('/buildings/2')
      .set('Authorization', `bearer ${token}`)
      .send(editedBuilding);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('id').string.uuid);
  });

  it('Should return 404 because when update building, organization_id does not exist in the database', async () => {
    const response = await request(app)
      .put(`/buildings/${buildingId}`)
      .set('Authorization', `bearer ${token}`)
      .send(buildingInvalid);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Id de organização não existe');
  });

  it('Should return 404 for update missing id building', async () => {
    const response = await request(app)
      .put(`/buildings/${idInexist}`)
      .set('Authorization', `bearer ${token}`)
      .send(editedBuilding);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Prédio não existe!');
  });

  // testes para visualição de prédio por id
  it('Should be able to get a building by Id and return 200', async () => {
    const response = await request(app)
      .get(`/buildings/${buildingId}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(editedBuilding.name);
    expect(response.body.latitude).toBe(editedBuilding.latitude);
    expect(response.body.longitude).toBe(editedBuilding.longitude);
    expect(response.body.description).toBe(editedBuilding.description);
    expect(response.body.organization_id).toBe(editedBuilding.organization_id);
  });

  it('Should return 404 for searching missing id building', async () => {
    const response = await request(app)
      .get(`/buildings/${idInexist}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Prédio não existe!');
  });

  it('Should return 400 when searching building by invalid type id', async () => {
    const response = await request(app).get(`/buildings/2`).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('id').string.uuid);
  });

  // testes para visualização de todos prédios
  it('Should be able to get all buildings', async () => {
    const response = await request(app).get('/buildings').set('Authorization', `bearer ${token}`);

    const repository = getCustomRepository(BuildingRepository);
    const allBuildings = await repository.find();

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(allBuildings.length);
  });

  // testes para deleção de prédio
  it('Should be able to delete a building', async () => {
    const response = await request(app)
      .delete(`/buildings/${buildingId}`)
      .set('Authorization', `bearer ${token}`);

    const repository = getCustomRepository(BuildingRepository);
    const deleted = await repository.findOne({ id: buildingId });

    expect(response.status).toBe(200);
    expect(deleted).toBeUndefined();
    expect(response.body.message).toBe('Prédio removido com sucesso!');
  });

  it('Should return 400 when delete building by invalid type id', async () => {
    const response = await request(app)
      .delete(`/buildings/2`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('id').string.uuid);
  });

  it('Should return 404 for delete missing id building', async () => {
    const response = await request(app)
      .delete(`/buildings/${idInexist}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Prédio não existe!');
  });
});
