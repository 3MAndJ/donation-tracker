//jest does not required import statement
const req = require('supertest');
const queryStrs = require('./queryStrs.js');
const server = 'http://localhost:3000';
const db = require('../server/models.js');
const getQuery = require('./getQuery.js');

describe('Route integration', () => {
  describe('GET /', () => {
    test('responds with status 200 and text/html content type', async () => {
      const res = await req(server).get('/');
      expect(res.type).toMatch(/text\/html/);
      expect(res.status).toEqual(200);
    });
  });

  describe('RootQuery: /graphql', () => {
    describe('items', () => {
      let res;

      beforeAll(async () => {
        const query = getQuery(queryStrs.items);
        res = await req(server).get('/graphql').send(query);
      });
      
      test('Expect response to have status 200 and a content-type of application/json', () => {
        expect(res.status).toEqual(200);
        expect(res.headers['content-type']).toMatch(/application\/json/);
      });

      test('Expect the res.body.data to be an obj', () => {
        expect(Array.isArray(res.body.data.items)).toEqual(true);
      });

      test('Expect res.body.data to have properties name, total_needed, total_received', () => {
        expect(res.body.data.items[0]).toHaveProperty('name');
        expect(res.body.data.items[0]).toHaveProperty('total_needed');
        expect(res.body.data.items[0]).toHaveProperty('total_received');
      });
    });

    describe('users', () => {
      let res;

      beforeAll(async () => {
        const query = getQuery(queryStrs.users);
        res = await req(server).get('/graphql').send(query);
      });

      test('Expect response to have status 200 and a content-type of application/json', () => {
        expect(res.status).toEqual(200);
        expect(res.headers['content-type']).toMatch(/application\/json/);
      });

      test('res.body.data.users should not be an empty array', () => {
        expect(res.body.data.users.length).toBeGreaterThan(0);
      });

      test('res.body.data.users should be an array of obj', () => {
        expect(Array.isArray(res.body.data.users)).toEqual(true);
        expect(typeof res.body.data.users[0]).toEqual('object');
        expect(Array.isArray(res.body.data.users[0])).toEqual(false);
      });
    });

    describe('item', () => {
      let res;

      beforeAll(async () => {
        const variables = {
          id: 1,
        };
        const query = getQuery(queryStrs.item, variables);
        res = await req(server).get('/graphql').send(query);
      });

      test('Expect response to have status 200 and a content-type of application/json', () => {
        expect(res.status).toEqual(200);
        expect(res.headers['content-type']).toMatch(/application\/json/);
      });

      test('res.body.data.item should be an obj with properties id, name, total_needed, total_received, and category', () => {
        expect(typeof res.body.data.item).toEqual('object');
        expect(res.body.data.item).toHaveProperty('id');
        expect(res.body.data.item).toHaveProperty('name');
        expect(res.body.data.item).toHaveProperty('total_needed');
        expect(res.body.data.item).toHaveProperty('total_received');
        expect(res.body.data.item).toHaveProperty('category');
      });
    });

    describe('chapter', () => {
      let res;

      beforeAll(async () => {
        const variables = {
          id: 4,
        };
        const query = getQuery(queryStrs.chapter, variables);
        res = await req(server).get('/graphql').send(query);
      });

      test('Expect response to have status 200 and a content-type of application/json', () => {
        expect(res.status).toEqual(200);
        expect(res.headers['content-type']).toMatch(/application\/json/);
      });

      test('res.body.data.chapter should be an object and res.body.data.items should be an array', () => {
        expect(typeof res.body.data.chapter).toEqual('object');
        expect(Array.isArray(res.body.data.chapter.items)).toEqual(true);
      });
    });

    describe('user', () => {
      let res;

      beforeAll(async () => {
        const variables = {
          email: 'milos@gmail.com',
        };
        const query = getQuery(queryStrs.user, variables);
        res = await req(server).get('/graphql').send(query);
      });

      test('Expect response to have status 200 and a content-type of application/json', () => {
        expect(res.status).toEqual(200);
        expect(res.headers['content-type']).toMatch(/application\/json/);
      });

      test('res.body.user should be an object ', () => {
        expect(typeof res.body.data.user).toEqual('object');
      });

      test('res.body.user should have properties first_name, last_name, and email', () => {
        expect(res.body.data.user).toHaveProperty('first_name');
        expect(res.body.data.user).toHaveProperty('last_name');
        expect(res.body.data.user).toHaveProperty('email');
      });
    });

    describe('chapters', () => {
      let res;

      beforeAll(async () => {
        const query = getQuery(queryStrs.chapters);
        res = await req(server).get('/graphql').send(query);
      });

      test('Expect response to have status 200 and a content-type of application/json', () => {
        expect(res.status).toEqual(200);
        expect(res.headers['content-type']).toMatch(/application\/json/);
      });
      test('res.body.data.chapters should not be an empty array', () => {
        expect(res.body.data.chapters.length).toBeGreaterThan(0);
      });

      test('res.body.data.users should be an array of obj', () => {
        expect(Array.isArray(res.body.data.chapters)).toEqual(true);
        expect(typeof res.body.data.chapters[0]).toEqual('object');
        expect(Array.isArray(res.body.data.chapters[0])).toEqual(false);
      });
    });
  });

  describe('GET /api/graphql', () => {});
});
