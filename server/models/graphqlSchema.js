const graphql = require('graphql');
require('dotenv').config();
const Query = require ('./graphqlQueries.js');
const Mutations = require('./graphqlMutations.js');
const Subscription = require('./graphqlSubscriptions.js');

const {
  GraphQLSchema,
} = graphql;



module.exports = new GraphQLSchema ({
  query: Query,
  mutation: Mutations,
  subscription: Subscription
});
