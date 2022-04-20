//jest does not required import statement
const req = require('supertest');
const queryStrs = require('./queryStrs.js');
const server = 'http://localhost:3000';

describe('Route integration', () => {
  const getQuery = (queryStr, variables = null) => {
    if (!variables) {
      return {
        query: queryStr,
      };
    }
    return {
      query: queryStr,
      variables: variables,
    };
  };

  describe('GET /', () => {
    test('responds with status 200 and text/html content type', async () => {
      const res = await req(server).get('/');
      expect(res.type).toMatch(/text\/html/);
      expect(res.status).toEqual(200);
    });
  });

  describe('GET /api/graphql', () => {});

  describe('RootQuery: /graphql', () => {
    describe('items', () => {
      test('Expect response to have status 200 and a content-type of application/json', async () => {
        const query = getQuery(queryStrs.items);
        const res = await req(server).get('/graphql').send(query);
        expect(res.status).toEqual(200);
        expect(res.headers['content-type']).toMatch(/application\/json/);
      });

      test('Expect the res.body.data to be an obj', async () => {
        const query = getQuery(queryStrs.items);
        const res = await req(server).get('/graphql').send(query);
        expect(Array.isArray(res.body.data.items)).toEqual(true);
      });
    });
  });

  describe('Mutation Queries: /graphql', () => {
    describe('Login query: sending the correct username and password', () => {
      const variables = {
        email: 'cdunleavy@mail.com',
        password: 'pass',
      };
      const query = getQuery(queryStrs.login, variables);

      test('Expect server to response with status 200 and a content-type of application/json', async () => {
        const res = await req(server).post('/graphql').send(query);
        expect(res.status).toEqual(200);
        expect(res.headers['content-type']).toMatch(/application\/json/);
      });
      test('Expect server to response with an obj with properties first_name, last_name, email, chapter_id, and token', async () => {
        const res = await req(server).post('/graphql').send(query);
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
      test('Should get something back', async () => {
        const variables = {
          first_name: 'Max',
          last_name: 'Nudol',
          email: 'max@mail.com',
          password: 'max',
          chapter_id: 2,
        };
        // const query = getQuery(queryStrs.addUser, variables);
        // const res = await req(server).post('/graphql').send(query);
        // console.log(res);
      });
    });
  });
});
/*
RootQuery
item
chapter
user
items
chapters
users

Mutation
addChapter
addNeed
updateItem
signUp
addUser
*/
/*
     const graphqlQuery = {
        query: `{
              chapters{
                name
                id
              }
            }`,
      };


*/
