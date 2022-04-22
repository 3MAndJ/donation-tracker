const { ApolloServer } = require( 'apollo-server-express');
const { createServer } = require( 'http');
const express = require( 'express');
const { ApolloServerPluginDrainHttpServer } = require( 'apollo-server-core');
const { makeExecutableSchema } = require( '@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require( 'graphql-ws/lib/use/ws');
const prisma = require('./models/context');
const schema = require('./models/graphqlSchema');
const { async } = require('regenerator-runtime');


// Create the schema, which will be used separately by ApolloServer and


// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

// Save the returned server's info so we can shutdown this server later
const serverCleanup = useServer({ schema }, wsServer);

// Set up ApolloServer.
const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
  context: ({req, res}) => {
    return {
      req,
      res,
      prisma
    };
  },
  introspection: true
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startServer();

const PORT = 4000;
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(
    `Server is now running on http://localhost:${PORT}${server.graphqlPath}`,
  );
});