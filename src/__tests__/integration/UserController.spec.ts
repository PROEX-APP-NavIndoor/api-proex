import request from 'supertest';
import { getConnection, getCustomRepository } from 'typeorm';
import { app } from '../../app';
import createConnection from '../../database';
import { EnumRoleUser } from '../../entities/User';
import { IUser } from '../../interfaces/IUser.interface';
import { UserRepository } from '../../repositories/UserRepository';
import { yupConfig } from '../../validators/YupConfig';

// ids de organizações cadastradas no seeders
const organizationId1 = 'ad8fb4ff-a518-42c0-af78-ac5062eaf53d';
const organizationId2 = '45659fc4-1946-4080-adba-d084543c3324';

// id inexistente
const idInexist = 'bf918fbb-94a9-4dd5-9db1-85ce524ed306';

// usuário criado na execução dos seeders
const loginUser = {
  email: 'user1@gmail.com',
  password: '123456',
};

const createUser : IUser = {
  name: 'User example',
  email: 'user@example.com',
  password: '123456',
  role: EnumRoleUser.super,
  organization_id: organizationId1,
};

const editedUser : IUser = {
  name: 'User example edited',
  email: 'user@example_edit.com',
  password: '123456',
  role: EnumRoleUser.normal,
  organization_id: organizationId2,
};

const userInvalid : IUser = {
  name: 'User example 10',
  email: 'user10@example.com',
  password: '123456',
  role: EnumRoleUser.normal,
  organization_id: idInexist,
};

let token: string;
let userId: string;

describe('Users', () => {
  beforeAll(async () => {
    await createConnection();
    const Login = await request(app).post('/login').send(loginUser);
    token = Login.body.token;
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.close();
  });

  // testes para criação de usuário
  it('Should be able to create a new user and return 201', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', `bearer ${token}`)
      .send(createUser);

    userId = response.body.id;

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(createUser.name);
    expect(response.body.email).toBe(createUser.email);
    expect(response.body.role).toBe(createUser.role);
    expect(response.body.organization_id).toBe(createUser.organization_id);
  });

  it('Should returns 400 beacause there is no user name', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', `bearer ${token}`)
      .send({
        email: 'user@example2.com.br',
        password: '123456',
        role: EnumRoleUser.super,
        organization_id: organizationId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('name').mixed.required);
  });

  it('Should returns 400 beacause there is no user email', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'User example 2',
        password: '123456',
        role: EnumRoleUser.super,
        organization_id: organizationId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('email').mixed.required);
  });

  it('Should returns 400 beacause there is no valid user email', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'User example 2',
        email: 'email_invalid.com',
        password: '123456',
        role: EnumRoleUser.super,
        organization_id: organizationId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('email').string.email);
  });

  it('Should returns 400 beacause there is no user password', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'User example 2',
        email: 'user@example2.com.br',
        role: EnumRoleUser.super,
        organization_id: organizationId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('password').mixed.required);
  });

  it('Should returns 400 beacause there is no user role', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'User example 2',
        email: 'user@example2.com.br',
        password: '123456',
        organization_id: organizationId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('role').mixed.required);
  });

  it('Should returns 400 beacause there is no valid user role', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'User example 2',
        email: 'user@example2.com.br',
        password: '123456',
        role: 'invalid',
        organization_id: organizationId1,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('role', ['super', 'normal', 'employee'].join(', ')).mixed.oneOf);
  });

  it('Should returns 400 beacause there is no user organization_id', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', `bearer ${token}`)
      .send({
        name: 'User example 2',
        email: 'user@example2.com.br',
        password: '123456',
        role: EnumRoleUser.super,
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('organization_id').mixed.required);
  });

  it('Should not be able to create a user with exists email and return 400', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', `bearer ${token}`)
      .send(createUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Usuário já existe');
  });

  it('Should return 404 because when registering users, organization_id does not exist in the database', async () => {
    const response = await request(app)
      .post('/users')
      .set('Authorization', `bearer ${token}`)
      .send(userInvalid);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Id de organização não existe');
  });

  // testes para atualização de usuário
  it('Should be able to edit a existing user and return 200', async () => {
    const response = await request(app)
      .put(`/users/${userId}`)
      .set('Authorization', `bearer ${token}`)
      .send(editedUser);

    const repository = getCustomRepository(UserRepository);
    const userUpdated = await repository.findOne({ id: userId });

    expect(response.status).toBe(200);
    expect(userUpdated.name).toBe(editedUser.name);
    expect(userUpdated.email).toBe(editedUser.email);
    expect(userUpdated.password).not.toBe(editedUser.password);
    expect(userUpdated.role).toBe(editedUser.role);
    expect(response.body.message).toBe('Usuário atualizado com sucesso!');
  });

  it('Should return 400 when update user by invalid type id', async () => {
    const response = await request(app)
      .delete(`/users/2`)
      .set('Authorization', `bearer ${token}`)
      .send(editedUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('id').string.uuid);
  });

  it('Should return 404 for update missing id user', async () => {
    const response = await request(app)
      .put(`/users/${idInexist}`)
      .set('Authorization', `bearer ${token}`)
      .send(editedUser);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Usuário não existe!');
  });

  // testes para visualização de usuário por id
  it('Should be able to get a user by Id and return 200', async () => {
    const response = await request(app)
      .get(`/users/${userId}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(editedUser.name);
    expect(response.body.email).toBe(editedUser.email);
    expect(response.body.role).toBe(editedUser.role);
  });

  it('Should return 404 for searching missing id user', async () => {
    const response = await request(app)
      .get(`/users/${idInexist}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Usuário não existe!');
  });

  it('Should return 400 when searching user by invalid type id', async () => {
    const response = await request(app).get(`/users/2`).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('id').string.uuid);
  });

  // testes para visualização de todos os usuários
  it('Should be able to get all users and return 200', async () => {
    const response = await request(app).get('/users').set('Authorization', `bearer ${token}`);

    const repository = getCustomRepository(UserRepository);
    const allUsers = await repository.find();

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(allUsers.length);
  });

  // testes para deleção de usuário
  it('Should be able to delete a user and return 200', async () => {
    const response = await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `bearer ${token}`);

    const repository = getCustomRepository(UserRepository);
    const deleted = await repository.findOne({ id: userId });

    expect(response.status).toBe(200);
    expect(deleted).toBeUndefined();
    expect(response.body.message).toBe('Usuário removido com sucesso!');
  });

  it('Should return 400 when delete user by invalid type id', async () => {
    const response = await request(app).delete(`/users/2`).set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(yupConfig('id').string.uuid);
  });

  it('Should return 404 for delete missing id user', async () => {
    const response = await request(app)
      .delete(`/users/${idInexist}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Usuário não existe!');
  });
});
