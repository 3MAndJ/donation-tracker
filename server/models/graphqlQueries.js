const graphql = require('graphql');
const db = require('../models.js');
require('dotenv').config();
const {ItemType, ChapterType, UserType, MessageType, VisitorsType, ChatType} = require ('./graphqlTypes.js');

const {
  GraphQLError,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
} = graphql;

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    chat: {
      type: ChatType,
      args: {
        id: {type: GraphQLInt}
      },
      async resolve(parent, args, context) {
        const chat = await context.prisma.chats.findUnique({
          where: { id: args.id},
          include: {
            users: true,
            visitors: true,
            messages: true,
          }
        }
        );
        
        chat.messages = chat.messages.sort((a, b) => b.created_at - a.created_at);
        return chat;
      }
    },
    visitor: {
      type: VisitorsType,
      args: {
        id: { type: GraphQLString }
      },
      async resolve(parent, args, context) {
        const visitor = await context.prisma.visitors.findUnique({
          where: { id: args.id },
          include: {
            chats: true,
          }
        }
        );

        return visitor;
      }
    },
    item: {
      type: ItemType,
      args: {
        id: {type: GraphQLInt}
      },
      resolve(parent, args, context) {
        return db.query('SELECT * FROM items WHERE id = $1', [args.id])
          .then(res => {
            if (!res.rows[0]) {
              context.response.status(404);
              throw new GraphQLError(`Error with item query: Item with id ${args.id} not found.`);
            }
            return res.rows[0];
          })
          .catch(err => err);
      }
    },
    chapter:{
      type: ChapterType,
      args: {
        id: {type: GraphQLInt}
      },
      resolve(parent, args, context) {
        return db.query('SELECT * FROM chapters WHERE id = $1', [args.id])
          .then(res => {
            if (!res.rows[0]) {
              context.response.status(404);
              throw new GraphQLError(`Error with chapter query: chapter with id ${args.id} not found.`);
            }
            return res.rows[0];
          })
          .catch(err => err);
      }
    },
    user: {
      type: UserType,
      args: {
        email: { type: GraphQLString }
      },
      resolve(parent, args, context) {
        return db.query('SELECT * FROM users WHERE email = $1;', [args.email])
          .then(res => {
            if (!res.rows[0]) {
              context.response.status(404);
              throw new GraphQLError(`Error with users query: User with email ${args.email} not found.`);
            }
            return res.rows[0];
          })
          .catch(err =>  err);
      }
    },
    items: {
      type: new GraphQLList(ItemType),
      resolve(parent, args){
        return db.query('SELECT * FROM items;')
          .then(res => {
            return res.rows;
          })
          .catch(err => err);
      }
    },
    chapters: {
      type: new GraphQLList(ChapterType),
      resolve(parent, args){
        return db.query('SELECT * FROM chapters;')
          .then(res => {
            return res.rows;
          })
          .catch(err => err);
      }
    },
    users: {
      type: new GraphQLList(UserType),
      resolve(parent, args, context) {
        return db.query('SELECT * FROM users;')
          .then(res => {
            return res.rows;
          })
          .catch(err => {
            const error = new GraphQLError(`Error with users query: ${err}`);
            context.response.status(500);
            return error;
          });
      }
    }
  },
});

module.exports = RootQuery;
