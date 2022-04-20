const req = require('supertest');
const queryStrs = require('./queryStrs.js');
const server = 'http://localhost:3000';
const db = require('../server/models.js');
const getQuery = require('./getQuery.js');

describe('Mutation Queries: /graphql', () => {
  describe('Login query: sending the correct username and password', () => {
    let res;

    beforeAll(async () => {
      const variables = {
        email: 'cdunleavy@mail.com',
        password: 'pass',
      };
      const query = getQuery(queryStrs.login, variables);
      res = await req(server).post('/graphql').send(query);
    });

    test('Expect server to response with status 200 and a content-type of application/json', () => {
      expect(res.status).toEqual(200);
      expect(res.headers['content-type']).toMatch(/application\/json/);
    });

    test('Expect server to response with an obj with properties first_name, last_name, email, chapter_id, and token', () => {
      expect(res.body.data.login).toHaveProperty('user');
      expect(res.body.data.login).toHaveProperty('token');
      expect(res.body.data.login.user).toHaveProperty('first_name');
      expect(res.body.data.login.user).toHaveProperty('last_name');
      expect(res.body.data.login.user).toHaveProperty('email');
      expect(res.body.data.login.user).toHaveProperty('chapter_id');
    });
  });

  describe('Login query: sending the wrong username and/or password', () => {
    test('Wrong Email: Expect response to have status 404, and a property errors', async () => {
      const variables = { email: 'NoUser@gmail.com', password: 'pass' };
      const query = getQuery(queryStrs.login, variables);
      const res = await req(server).post('/graphql').send(query);
      expect(res.status).toEqual(404);
      expect(res.body).toHaveProperty('errors');
    });
    test('Wrong Password: Expect response to have status 403, and a property errors', async () => {
      const variables = {
        email: 'cdunleavy@mail.com',
        password: 'wrongPassword',
      };
      const query = getQuery(queryStrs.login, variables);
      const res = await req(server).post('/graphql').send(query);
      expect(res.status).toEqual(403);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('addUser query', () => {
    // beforeEach(async () => {
    //   await db.query(`DELETE FROM users WHERE users.email = 'max@gmail.com';`);
    // });

    test('Should get something back', async () => {
      const variables = {
        first_name: 'Max',
        last_name: 'Nudol',
        email: 'max@gmail.com',
        password: 'max',
        chapter_id: 3,
      };
      // const query = getQuery(queryStrs.addUser, variables);
      // const res = await req(server).post('/graphql').send(query);
      // await db.query(
      //   `DELETE FROM users WHERE users.email = 'max@gmail.com';`
      // );
      // console.log(res);
    });
  });
});

/*
Mutation
addChapter
addNeed
updateItem
signUp
addUser
*/