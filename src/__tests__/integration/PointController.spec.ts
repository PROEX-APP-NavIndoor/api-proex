import request from 'supertest';
import { getConnection, getCustomRepository } from 'typeorm';
import { app } from '../../app';
import createConnetion from '../../database';
import { IPointParent } from '../../interfaces/IPointParent.interface';
import { IPointChild } from '../../interfaces/IPointChild.interface';
import { PointRepository } from '../../repositories/PointRepository';
import { pointToData } from '../../services/pointServices/PointParentService';
import { yupConfig } from '../../validators/YupConfig'
import { EnumTypePoint } from '../../entities/PointParent';
import { PointParentRepository } from '../../repositories/Point_ParentRepository';
import { PointChildRepository } from '../../repositories/Point_ChildRepository';

// ids de mapas cadastradas no seeders
const mapId1 = 'b30996e8-e87f-4ce7-aaa2-b76c9bb1cc1e';
const mapId2 = 'd80c3e0f-97b7-4a1d-bba3-384db2c1ff5c';

// id inexistente
const idInexist = 'c3f9b94b-b219-490f-85f7-10195b51178f';

const createParent: IPointParent = {
  name: 'Point Parent Test',
  description: 'Point Parent Test Description',
  floor: 1,
  x: 5.123,
  y: 30.3347773,
  type: EnumTypePoint.passage,
  neighbor: [
    {
      id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
      direction: "e"
    }
  ],
  map_id: mapId1,
};

const editParent: IPointParent = {
  name: 'Point Parent Test Edited',
  description: 'Point Parent Test Description Edited',
  floor: 1,
  x: 1.123,
  y: 30.3347773,
  type: EnumTypePoint.passage,
  neighbor: [
    {
      id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
      direction: "w"
    }
  ],
  map_id: mapId1,
};

const invalidParent: IPointParent = {
  name: 'Point Parent Test Edited',
  description: 'Point Parent Test Description Edited',
  floor: 1,
  x: 1.123,
  y: 30.3347773,
  type: EnumTypePoint.passage,
  neighbor: [
    {
      id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
      direction: "w"
    }
  ],
  map_id: idInexist,
};

const createChild: IPointChild = {
  name: 'Point Child Test',
  description: 'Point Child Test Description',
  floor: 1,
  x: 5.123,
  y: 32.3347773,
  point_parent_id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
  is_obstacle: true,
  map_id: mapId1
};

const editChild: IPointChild = {
  name: 'Point Child Test Edited',
  description: 'Point Child Test Description Edited',
  floor: 1,
  x: 5.123,
  y: 25.3347773,
  is_obstacle: false,
  map_id: mapId1
};

const invalidChild: IPointChild = {
  name: 'Point Child Test Edited',
  description: 'Point Child Test Description Edited',
  floor: 1,
  x: 5.123,
  y: 25.3347773,
  point_parent_id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
  is_obstacle: false,
  map_id: idInexist
};

// usuário criado na execução dos seeders
const loginUser = {
  email: 'user1@gmail.com',
  password: '123456',
};

let token: string;
let parentId: string;
let childId: string;

describe('Points', () => {
  beforeAll(async () => {
    await createConnetion();
    const Login = await request(app).post('/login').send(loginUser);
    token = Login.body.token;
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.close();
  });

  // testes para criação de pontos pai
  it('Should be able to create a new point parent and return 201', async () => {
    const response = await request(app)
      .post('/points/parent')
      .set('Authorization', `bearer ${token}`)
      .send(createParent);

    parentId = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(createParent.name);
    expect(response.body.description).toBe(createParent.description);
    expect(response.body.floor).toBe(createParent.floor);
    expect(response.body.x).toBe(createParent.x);
    expect(response.body.y).toBe(createParent.y);
    expect(response.body.type).toBe(createParent.type);
    expect(response.body.neighbor).toEqual(createParent.neighbor);
    expect(response.body.map_id).toBe(createParent.map_id);
  });

  it('Should returns 400 beacause there is no point name', async () => {
    const response = await request(app)
      .post('/points/parent')
      .set('Authorization', `bearer ${token}`)
      .send({
        description: 'Point Parent Test Description',
        floor: 1,
        x: 1.123,
        y: 30.3347773,
        type: EnumTypePoint.passage,
        neighbor: [
          {
            id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
            direction: "w"
          }
        ],
        map_id: idInexist,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('name').mixed.required);
  });

  it('Should returns 400 beacause there is no point description', async () => {
    const response = await request(app)
      .post('/points/parent')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Point Parent Test',
        floor: 1,
        x: 5.123,
        y: 30.3347773,
        type: EnumTypePoint.passage,
        neighbor: [
          {
            id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
            direction: "e"
          }
        ],
        map_id: mapId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('description').mixed.required);
  });

  it('Should returns 400 beacause there is no point floor', async () => {
    const response = await request(app)
      .post('/points/parent')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Point Parent Test',
        description: 'Point Parent Test Description',
        x: 5.123,
        y: 30.3347773,
        type: EnumTypePoint.passage,
        neighbor: [
          {
            id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
            direction: "e"
          }
        ],
        map_id: mapId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('floor').mixed.required);
  });

  it('Should returns 400 beacause there is no point x', async () => {
    const response = await request(app)
      .post('/points/parent')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Point Parent Test',
        description: 'Point Parent Test Description',
        floor: 1,
        y: 30.3347773,
        type: EnumTypePoint.passage,
        neighbor: [
          {
            id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
            direction: "e"
          }
        ],
        map_id: mapId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('x').mixed.required);
  });

  it('Should returns 400 beacause there is no point y', async () => {
    const response = await request(app)
      .post('/points/parent')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Point Parent Test',
        description: 'Point Parent Test Description',
        floor: 1,
        x: 5.123,
        type: EnumTypePoint.passage,
        neighbor: [
          {
            id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
            direction: "e"
          }
        ],
        map_id: mapId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('y').mixed.required);
  });

  it('Should returns 400 beacause there is no point type', async () => {
    const response = await request(app)
      .post('/points/parent')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Point Parent Test',
        description: 'Point Parent Test Description',
        floor: 1,
        x: 5.123,
        y: 30.3347773,
        neighbor: [
          {
            id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
            direction: "e"
          }
        ],
        map_id: mapId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('type').mixed.required);
  });

  it('Should returns 400 beacause there is no point neighbor', async () => {
    const response = await request(app)
      .post('/points/parent')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Point Test',
        description: 'Point Test Description',
        floor: 1,
        x: -25.3347702,
        y: -47.5304402,
        type: EnumTypePoint.passage,
        map_id: mapId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('neighbor').mixed.required);
  });

  it('Should returns 400 beacause there is no point map_id', async () => {
    const response = await request(app)
      .post('/points/parent')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Point Parent Test',
        description: 'Point Parent Test Description',
        floor: 1,
        x: 5.123,
        y: 30.3347773,
        type: EnumTypePoint.passage,
        neighbor: [
          {
            id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
            direction: "e"
          }
        ],
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('map_id').mixed.required);
  });

  it('Should not be able to create a point that already exists and return 400', async () => {
    const response = await request(app)
      .post('/points/parent')
      .set('Authorization', `bearer ${token}`)
      .send(createParent);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Ponto já existe');
  });

  it('Should return 404 because when registering point, map_id does not exist in the database', async () => {
    const response = await request(app)
      .post('/points/parent')
      .set('Authorization', `bearer ${token}`)
      .send(invalidParent);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Id de mapa não existe');
  });

  // testes para criação de pontos filho
  it('Should be able to create a new point child and return 201', async () => {
    const response = await request(app)
      .post('/points/child')
      .set('Authorization', `bearer ${token}`)
      .send(createChild);

    childId = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(createChild.name);
    expect(response.body.description).toBe(createChild.description);
    expect(response.body.floor).toBe(createChild.floor);
    expect(response.body.x).toBe(createChild.x);
    expect(response.body.y).toBe(createChild.y);
    expect(response.body.is_obstacle).toBe(createChild.is_obstacle);
    expect(response.body.point_parent_id).toBe(createChild.point_parent_id);
    expect(response.body.map_id).toBe(createChild.map_id);
  });

  it('Should returns 400 beacause there is no point name', async () => {
    const response = await request(app)
      .post('/points/child')
      .set('Authorization', `bearer ${token}`)
      .send({
        description: 'Point Child Test Description',
        floor: 1,
        x: 5.123,
        y: 32.3347773,
        point_parent_id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
        is_obstacle: true,
        map_id: mapId1
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('name').mixed.required);
  });

  it('Should returns 400 beacause there is no point description', async () => {
    const response = await request(app)
      .post('/points/child')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Point Child Test',
        floor: 1,
        x: 5.123,
        y: 32.3347773,
        point_parent_id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
        is_obstacle: true,
        map_id: mapId1
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('description').mixed.required);
  });

  it('Should returns 400 beacause there is no point floor', async () => {
    const response = await request(app)
      .post('/points/child')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Point Child Test',
        description: 'Point Child Test Description',
        x: 5.123,
        y: 32.3347773,
        point_parent_id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
        is_obstacle: true,
        map_id: mapId1
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('floor').mixed.required);
  });

  it('Should returns 400 beacause there is no point x', async () => {
    const response = await request(app)
      .post('/points/child')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Point Child Test',
        description: 'Point Child Test Description',
        floor: 1,
        y: 32.3347773,
        point_parent_id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
        is_obstacle: true,
        map_id: mapId1
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('x').mixed.required);
  });

  it('Should returns 400 beacause there is no point y', async () => {
    const response = await request(app)
      .post('/points/child')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Point Child Test',
        description: 'Point Child Test Description',
        floor: 1,
        x: 5.123,
        point_parent_id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
        is_obstacle: true,
        map_id: mapId1
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('y').mixed.required);
  });

  it('Should returns 400 beacause there is no point_parent_id', async () => {
    const response = await request(app)
      .post('/points/child')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Point Child Test',
        description: 'Point Child Test Description',
        floor: 1,
        x: 5.123,
        y: 32.3347773,
        is_obstacle: true,
        map_id: mapId1
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('point_parent_id').mixed.required);
  });

  it('Should returns 400 beacause there is no point is_obstacle', async () => {
    const response = await request(app)
      .post('/points/child')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Point Child Test',
        description: 'Point Child Test Description',
        floor: 1,
        x: 5.123,
        y: 32.3347773,
        point_parent_id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
        map_id: mapId1
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('is_obstacle').mixed.required);
  });

  it('Should returns 400 beacause there is no point map_id', async () => {
    const response = await request(app)
      .post('/points/child')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'Point Child Test',
        description: 'Point Child Test Description',
        floor: 1,
        x: 5.123,
        y: 32.3347773,
        point_parent_id: "7673ae02-8c33-46a4-a7ea-14836259dbc0",
        is_obstacle: true
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('map_id').mixed.required);
  });

  it('Should not be able to create a point that already exists and return 400', async () => {
    const response = await request(app)
      .post('/points/child')
      .set('Authorization', `bearer ${token}`)
      .send(createChild);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Ponto já existe');
  });

  it('Should return 404 because when registering point, map_id does not exist in the database', async () => {
    const response = await request(app)
      .post('/points/child')
      .set('Authorization', `bearer ${token}`)
      .send(invalidChild);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Id de mapa não existe');
  });


  // testes para edição de ponto pai
  it('Should be able to edit a existing point and return 200', async () => {
    const response = await request(app)
      .put(`/points/parent/${parentId}`)
      .set('Authorization', `bearer ${token}`)
      .send(editParent);

    const pointRepository = getCustomRepository(PointRepository);
    const parentRepository = getCustomRepository(PointParentRepository);
    const pointUpdated = await pointRepository.findOne({ id: parentId });
    const parentUpdated = pointToData(await parentRepository.findOne({ id: parentId }));

    expect(response.status).toBe(200);
    expect(editParent.name).toBe(pointUpdated.name);
    expect(editParent.description).toBe(pointUpdated.description);
    expect(editParent.floor).toBe(pointUpdated.floor);
    expect(editParent.x).toBe(pointUpdated.x);
    expect(editParent.y).toBe(pointUpdated.y);
    expect(editParent.type).toBe(parentUpdated.type);
    expect(editParent.neighbor).toEqual(parentUpdated.neighbor);
    expect(response.body.message).toBe('Ponto atualizado com sucesso!');
  });

  it('Should return 400 when update point by invalid type id', async () => {
    const response = await request(app)
      .put(`/points/parent/2`)
      .set('Authorization', `bearer ${token}`)
      .send(editParent);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('id').string.uuid);
  });

  it('Should return 404 for update missing id point', async () => {
    const response = await request(app)
      .put(`/points/parent/${idInexist}`)
      .set('Authorization', `bearer ${token}`)
      .send(editParent);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Ponto não existe!');
  });

  // testes para edição de ponto filho
  it('Should be able to edit a existing point and return 200', async () => {
    editChild.point_parent_id = parentId;

    const response = await request(app)
      .put(`/points/child/${childId}`)
      .set('Authorization', `bearer ${token}`)
      .send(editChild);

    const pointRepository = getCustomRepository(PointRepository);
    const childRepository = getCustomRepository(PointChildRepository);
    const pointUpdated = await pointRepository.findOne({ id: childId });
    const childUpdated = await childRepository.findOne({ id: childId });

    expect(response.status).toBe(200);
    expect(editChild.name).toBe(pointUpdated.name);
    expect(editChild.description).toBe(pointUpdated.description);
    expect(editChild.floor).toBe(pointUpdated.floor);
    expect(editChild.x).toBe(pointUpdated.x);
    expect(editChild.y).toBe(pointUpdated.y);
    expect(editChild.is_obstacle).toBe(childUpdated.is_obstacle);
    expect(editChild.point_parent_id).toEqual(childUpdated.point_parent_id);
    expect(response.body.message).toBe('Ponto atualizado com sucesso!');
  });

  it('Should return 400 when update point by invalid type id', async () => {
    const response = await request(app)
      .put(`/points/child/2`)
      .set('Authorization', `bearer ${token}`)
      .send(editChild);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('id').string.uuid);
  });

  it('Should return 404 for update missing id point', async () => {
    const response = await request(app)
      .put(`/points/child/${idInexist}`)
      .set('Authorization', `bearer ${token}`)
      .send(editChild);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Ponto não existe!');
  });


  // testes para visualição de pontos
  it('Should be able to get a point by Id and return 200', async () => {
    const mapId = (await request(app)
      .get(`/maps`)
      .set('Authorization', `bearer ${token}`)).body[0].id;

    const response = await request(app)
      .get(`/maps/${mapId}`)
      .set('Authorization', `bearer ${token}`);

    const parent = response.body.points.find(point => point.id == parentId);

    expect(response.status).toBe(200);
    expect(parent.name).toBe(editParent.name);
    expect(parent.description).toBe(editParent.description);
    expect(parent.floor).toBe(editParent.floor);
    expect(parent.x).toBe(editParent.x);
    expect(parent.y).toBe(editParent.y);
    expect(parent.type).toBe(editParent.type);
    expect(parent.neighbor).toEqual(editParent.neighbor);
    expect(parent.map_id).toBe(createParent.map_id); //editPoint can't change map_id

    expect(parent.children.length).toBe(1);
    expect(parent.children[0].id).toBe(childId);
    expect(parent.children[0].name).toBe(editChild.name);
    expect(parent.children[0].description).toBe(editChild.description);
    expect(parent.children[0].x).toBe(editChild.x);
    expect(parent.children[0].y).toBe(editChild.y);
    expect(parent.children[0].floor).toBe(editChild.floor);
    expect(parent.children[0].is_obstacle).toBe(editChild.is_obstacle);
    expect(parent.children[0].point_parent_id).toBe(editChild.point_parent_id);
  });

  // testes para deleção de ponto
  it('Should be able to delete a point', async () => {
    const response = await request(app)
      .delete(`/points/parent/${parentId}`)
      .set('Authorization', `bearer ${token}`);

    const repository = getCustomRepository(PointRepository);
    const deleted = await repository.findOne({ id: parentId });

    expect(response.status).toBe(200);
    expect(deleted).toBeUndefined();
    expect(response.body.message).toBe('Ponto removido com sucesso!');
  });

  it('Should return 400 when delete point by invalid type id', async () => {
    const response = await request(app).delete(`/points/parent/2`).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('id').string.uuid);
  });

  it('Should return 404 for delete missing id point', async () => {
    const response = await request(app)
      .delete(`/points/parent/${idInexist}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Ponto não existe!');
  });
});
