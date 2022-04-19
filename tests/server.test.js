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
      try {
        const res = await req(server).get('/');
        expect(res.type).toMatch(/text\/html/);
        expect(res.status).toEqual(200);
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe('GET /api/graphql', () => {});

  describe('RootQuery: /graphql', () => {
    describe('item: ', () => {

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
        try {
          const res = await req(server).post('/graphql').send(query);
          expect(res.status).toEqual(200);
          expect(res.headers['content-type']).toMatch(/application\/json/);
        } catch (err) {
          console.log(err);
        }
      });
      test('Expect server to response with an obj with properties first_name, last_name, email, chapter_id, and token', async () => {
        try {
          const res = await req(server).post('/graphql').send(query);
          expect(res.body.data.login).toHaveProperty('user');
          expect(res.body.data.login).toHaveProperty('token');
          expect(res.body.data.login.user).toHaveProperty('first_name');
          expect(res.body.data.login.user).toHaveProperty('last_name');
          expect(res.body.data.login.user).toHaveProperty('email');
          expect(res.body.data.login.user).toHaveProperty('chapter_id');
        } catch (err) {
          console.log(err);
        }
      });
    });

    describe('Login query: sending the wrong username and/or password', () => {
      test('Wrong Email: Expect response to have status 404, and a property errors', async () => {
        try {
          const variables = { email: 'NoUser@gmail.com', password: 'pass' };
          const query = getQuery(queryStrs.login, variables);
          const res = await req(server).post('/graphql').send(query);
          expect(res.status).toEqual(404);
          expect(res.body).toHaveProperty('errors');
        } catch (err) {
          console.log(err);
        }
      });
      test('Wrong Password: Expect response to have status 403, and a property errors', async () => {
        try {
          const variables = {
            email: 'cdunleavy@mail.com',
            password: 'wrongPassword',
          };
          const query = getQuery(queryStrs.login, variables);
          const res = await req(server).post('/graphql').send(query);
          expect(res.status).toEqual(403);
          expect(res.body).toHaveProperty('errors');
        } catch (err) {
          console.log(err);
        }
      });
    });

    describe('addUser query: sending the correct username and password', () => {});
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

          const graphqlQuery = {
      'query': `{
        items {
          name
          total_needed
          total_received
        }
      }`,
    };
*/
