const graphql = require('graphql');
const db = require('../models.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const {ItemType, ChapterType, UserType, AuthPayload, VisitorsType, ChatType, MessageType} = require ('./graphqlTypes.js');
const { prisma } = require('@prisma/client');
const { user } = require('pg/lib/defaults');
const pubsub = require('./pubsub.js');

const {
    GraphQLError,
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLInt,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const Mutations = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addVisitor: {
      type: VisitorsType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        first_name: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args, context) {
        const visitor = await context.prisma.visitors.create({
          data: {
            email: args.email,
            first_name: args.first_name
          },
          select: {
            id: true,
            email: true,
            first_name: true,
          }
        });

        return visitor;
      }
    },
    createChat: {
      type: ChatType,
      args: {
        user: { type: new GraphQLNonNull(GraphQLString)},
        visitor: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args, context) {
        const chat = await context.prisma.chats.create({
          data: {
            chapter_user: args.user,
            visitor: args.visitor
          },
          select: {
            id: true,
            users: true,
            visitors: true
          }
        });
        return chat;
      }
    },
    createMessage: {
      type: MessageType,
      args: {
        message: { type: new GraphQLNonNull(GraphQLString) },
        sent_by: { type: new GraphQLNonNull(GraphQLString) },
        received_by: { type: new GraphQLNonNull(GraphQLString) },
        chat_id: { type: new GraphQLNonNull(GraphQLInt) }
      },
      async resolve(parent, args, context) {
        const message = await context.prisma.messages.create({
          data: {
            message: args.message,
            sent_by: args.sent_by,
            received_by: args.received_by,
            chat_id: args.chat_id
          },
          select: {
            created_at: true,
            received_by: true,
            sent_by: true,
            message: true,
            chats: {
              select: {
                id: true,
                users: true,
                visitors: true,
                messages: true
              }
            }
          }
        });

        message.chats.messages = message.chats.messages.sort((a, b) => b.created_at - a.created_at);
        pubsub.publish('NEW_MESSAGE', { newMessage: message.chats});
        return message;
      }
    },
    addChapter: {
      type: ChapterType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        street: { type: new GraphQLNonNull(GraphQLString) },
        city: { type: new GraphQLNonNull(GraphQLString) },
        state: { type: new GraphQLNonNull(GraphQLString) },
        zip: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        longitude: { type: new GraphQLNonNull(GraphQLFloat) },
        latitude: { type: new GraphQLNonNull(GraphQLFloat) }
      },
      resolve(parent, args) {
        return db
          .query(
            'INSERT INTO chapters (name, zip, street, city, state, phone, email, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;',
            [
              args.name,
              args.zip,
              args.street,
              args.city,
              args.state,
              args.phone,
              args.email,
              args.latitude,
              args.longitude,
            ]
          )
          .then((res) => {
            return res.rows[0];
          })
          .catch(err => err);
      },
    },
    addNeed: {
      type: ItemType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLString) },
        total_needed: { type: new GraphQLNonNull(GraphQLInt) },
        total_received: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        return db
          .query(
            'INSERT INTO items (name, category, total_needed, total_received) VALUES ($1, $2, $3, $4) RETURNING *;',
            [args.name, args.category, args.total_needed, args.total_received]
          )
          .then((res) => {
            return res.rows[0];
          })
          .catch(err => err);
      },
    },
    updateItem: {
      type: ChapterType,
      args: {
        item_id: { type: new GraphQLNonNull(GraphQLInt) },
        total_received: { type: new GraphQLNonNull(GraphQLInt) },
        chapter_id: { type: GraphQLInt }
      },
      async resolve(parent, args, context) {
        try {
          const chapterItem = await context.prisma.chapter_items.upsert({
            create: {
              chapter_id: args.chapter_id,
              item_id: args.item_id,
              total_received: args.total_received,
            },
            update: {
              total_received: {
                increment: args.total_received,
              },
            },
            where: {
              'chapter_id_item_id': {
                chapter_id: args.chapter_id,
                item_id: args.item_id
              }
            },
            include: {
              chapters: true
            }
          });

          const item = await context.prisma.items.update({
            data: {
              total_received: {
                increment: args.total_received,
              }
            },
            where: {
              id: args.item_id,
            }
          });

          return chapterItem.chapters;
        }
        catch (err) {
          return err;
        }
      }
    },
    signUp: {
      type: AuthPayload,
      args: {
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString },
        chapter_id: { type: GraphQLInt },
      },
      async resolve(parent, args, context) {
        try {
          const password = await bcrypt.hash(args.password, saltRounds);
          const user = await context.prisma.users.create({
            data: { ...args, password },
          });

          const token = jwt.sign({ email: args.email }, process.env.TOKEN_KEY, {
            expiresIn: '1h',
          });

          return {
            token,
            user,
          };
        } catch (error) {
          return error;
        }
      },
    },
    addUser: {
      type: UserType,
      args: {
        first_name: { type: new GraphQLNonNull(GraphQLString) },
        last_name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        chapter_id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      async resolve(parent, args, context) {
        try {
          const password = await bcrypt.hash(args.password, saltRounds);
          const user = await context.prisma.users.create({
            data: { ...args, password },
          });

          return user;
        } catch (error) {
          return error;
        }
      },
    },
    login: {
      type: AuthPayload,
      args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(parent, args, context) {
        try {
          //find email from database with prisma
          const user = await context.prisma.users.findUnique({
            where: {
              email: args.email,
            },
          });

          if (!user) {
            context.response.status(404);
            throw new GraphQLError('No user found');
          }

          //compare password
          const result = await bcrypt.compare(args.password, user.password);
          if (!result) {
            context.response.status(403);
            throw new GraphQLError('Username or password don\'t match');
          }
          //create Token
          const token = jwt.sign({ email: args.email }, process.env.TOKEN_KEY, {
            expiresIn: '1h',
          });
          return {
            token,
            user,
          };
        }
        catch (error){
          return error;
        }
      }
    },
  },
});


module.exports = Mutations;
