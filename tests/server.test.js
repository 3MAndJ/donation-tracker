//jest does not required import statement
const req = require("supertest");
const queries = require("./testQueries.js");
const server = "http://localhost:3000";

describe("Route integration", () => {
  describe("GET /", () => {
    test("responds with status 200 and text/html content type", async () => {
      try {
        const res = await req(server).get("/");
        expect(res.type).toMatch(/text\/html/);
        expect(res.statusCode).toEqual(200);
      } catch (err) {
        console.log(err);
      }
    });
  });

  describe("GET /api/graphql", () => {});

  describe("POST /graphql", () => {
    describe("Login query: sending the correct username and password", () => {
      const graphqlQuery = queries.correctLogin;

      test("Expect server to response with status 200 and a content-type of application/json", async () => {
        try {
          const res = await req(server).post("/graphql").send(graphqlQuery);
          expect(res.statusCode).toEqual(200);
          expect(res.headers["content-type"]).toMatch(/application\/json/);
        } catch (err) {
          console.log(err);
        }
      });
      test("Expect server to response with an obj with properties first_name, last_name, email, chapter_id, and token", async () => {
        const res = await req(server).post("/graphql").send(graphqlQuery);
        expect(res.body.data.login).toHaveProperty("user");
        expect(res.body.data.login).toHaveProperty("token");
        expect(res.body.data.login.user).toHaveProperty("first_name");
        expect(res.body.data.login.user).toHaveProperty("last_name");
        expect(res.body.data.login.user).toHaveProperty("email");
        expect(res.body.data.login.user).toHaveProperty("chapter_id");
      });
    });

    describe("Login query: sending the wrong username and/or password", () => {
      const wrongEmail = queries.wrongEmail;
      const wrongPassword = queries.wrongPassword;
      test("Wrong Email: Expect response to have status 404, and a property errors", async () => {
        const res = await req(server).post("/graphql").send(wrongEmail);
        expect(res.status).toEqual(404);
        expect(res.body).toHaveProperty("errors");
      });
      test("Wrong Password: Expect response to have status 403, and a property errors", async () => {
        const res = await req(server).post("/graphql").send(wrongPassword);
        expect(res.status).toEqual(403);
        expect(res.body).toHaveProperty("errors");
      });
    });

    describe("Login query: sending the correct username and password", () => {

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
