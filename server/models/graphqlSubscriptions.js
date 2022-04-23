const {
  GraphQLError,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');
const { ChatType } = require('./graphqlTypes');
const pubsub = require('./pubsub');
const { withFilter } = require('graphql-subscriptions');

const Subscription = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    newMessage: {
      type: ChatType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) }
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(['NEW_MESSAGE']),
        (payload, variables) => {
          console.log('NewMessage')
          return payload.newMessage.id === variables.id;
        }
      )
    }
  }
});

module.exports = Subscription;