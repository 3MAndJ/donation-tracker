const {
  GraphQLError,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} = require('graphql');
const { MessageType } = require('./graphqlTypes');
const pubsub = require('./pubsub');

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    newMessage: {
      type: MessageType,
      subscribe: () => pubsub.asyncIterator(['NEW_MESSAGE'])
    }
  }
});

module.exports = Subscription;