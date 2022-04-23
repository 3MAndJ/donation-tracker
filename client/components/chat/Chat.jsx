import React, { useEffect, useState, useContext } from 'react';
import './chat.css';
import { UserContext } from '../../hooks/userContext';
import ChatIcon from '@mui/icons-material/Chat';
import Button from '@mui/material/Button';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useSubscription,
  useMutation,
  gql,
  useQuery,
  split,
  HttpLink
} from '@apollo/client';
import queries from '../../models/queries';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';


const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://localhost:4000/graphql',
}));

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql'
});


// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
});

export default function Chat() {
  const { subscribeToMore, data, loading } = useQuery(queries.getChats, {
    variables: {
      chatId: 2,
    },
  });
  const  [postMessage, result] = useMutation(queries.postMessage);
  const [addVisitor, visitor] = useMutation(queries.addVisitor);

  const {user} = useContext(UserContext);
  const [chatActive, setChatActive] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [chatUser, setChatUser] = useState({});
  const [guestInput, setGuestInput] = useState({
    name: '',
    email: '',
  });
  const [mockMessages, setMockMessages] = useState({});

  useEffect(() => {
    if (loading) return;
    console.log(data);
    setMockMessages(data);
  }, [loading, data]);

/* Subscribing to the GET_MESSAGES query and updating the query with the new data. */
  useEffect(() => {
    subscribeToMore({
      document: queries.getMessages,
      variables: { id: 2 },
      updateQuery: (prev, { subscriptionData }) => {
        console.log('In subscribetomore')
        if (!subscriptionData.data.newMessage) return prev;
        console.log('Subscription Updated')
        console.log(prev)
        console.log(subscriptionData)
        return Object.assign({}, prev, subscriptionData.data.newMessage);
      },
      
    });
  },[]);
  // const [mockMessages, setMockMessages] = auseState({
  //   data: {
  //     chat: {
  //       users: {
  //         first_name: 'Milos',
  //       },
  //       visitors: {
  //         first_name: 'Jonathan',
  //       },
  //       messages: [
  //         {
  //           created_at: '1650594668915',
  //           received_by: 'ff1a73a8-540e-4bce-a86f-899347d61c3e',
  //           sent_by: '123test@testemail.com',
  //           message: 'First Message',
  //         },
  //       ],
  //     },
  //   },
  // });

  useEffect(() => {
    const chat = document.querySelector('.chat');
    const chatCloseAndChapter = document.querySelector('.chatCloseAndChapter');
    const chatMessages = document.querySelector('.chatMessages');
    const userInput = document.querySelector('.userInput');
    const chatIcon = document.querySelector('.chatIcon');
    const chatButton = document.querySelector('.chatButton');
    const guestForm = document.querySelector('.guestForm');

    if (!chatActive) {
      if (chatUser.name) {
        chatMessages.classList.remove('active');
        userInput.classList.remove('active');
        chatButton.style.display = 'none';
      } else {
        guestForm.classList.remove('active');
      }
      chatCloseAndChapter.classList.remove('active');
      chatIcon.style.display = 'block';
      chat.classList.remove('active');
    } else {
      if (chatUser.name) {
        chatMessages.classList.add('active');
        userInput.classList.add('active');
        chatButton.style.display = 'block';
      } else {
        guestForm.classList.add('active');
      }
      chatCloseAndChapter.classList.add('active');
      chatIcon.style.display = 'none';
      chat.classList.add('active');
    }
  }, [chatActive]);

  useEffect(() => {
    const userInput = document.querySelector('.userInput');
    const chatMessages = document.querySelector('.chatMessages');
    const chatButton = document.querySelector('.chatButton');
    console.log('chatUser', chatUser);

    if (chatUser.name && chatActive) {
      userInput.classList.add('active');
      chatMessages.classList.add('active');
      chatButton.style.display = 'block';
    }
    if (!chatActive && user) chatButton.style.display = 'none';
  }, [chatUser]);

  useEffect(() => {
    console.log('userchanged', user);
    if (user) {
      setChatUser({
        name: user.firstName,
        email: user.email
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userMessage !== '') {
      postMessage({
        variables: { message: userMessage, 
          sentBy: chatUser.name,
          receivedBy: chatUser.id ? mockMessages.chat.users.email : mockMessages.chat.visitors.id, 
          chatId: 2 
        },
      })
        .then(() => {
          client.refetchQueries({
            include: [queries.getChats]
          })
        })

      // const newMessages = [
      //   {
      //     created_at: 'test',
      //     received_by: 'test',
      //     sent_by: chatUser.email,
      //     message: userMessage,
      //   },
      //   ...mockMessages.data.chat.messages,
      // ];

      // setMockMessages({
      //   data: {
      //     chat: {
      //       ...mockMessages.data.chat,
      //       messages: newMessages,
      //     },
      //   },
      // });
      setUserMessage('');
    }
  };

  useEffect(() => {
    if (visitor.loading || !visitor.called || !visitor.data) return;
    setChatUser({
      name: visitor.data.addVisitor.first_name,
      email: visitor.data.addVisitor.email,
      chats: [],
      id: visitor.data.addVisitor.id
    });
  }, [visitor.loading]);

  const handleGuestSignup = (e) => {
    e.preventDefault();

    if (guestInput.name !== '' && guestInput.email !== '') {
      return addVisitor({
        variables: {
          email: guestInput.email,
          firstName: guestInput.name,
        },
      });
    }
  };


  // const {data: testData} = useSubscription(queries.getMessages);

  // useEffect(() => {
  //   console.log(testData);
  // }, [testData]);
  

  return (
    <div className="chat">
      {chatUser.name ? (
        <>
          <div className="chatCloseAndChapter">
            <div className="chatClose" onClick={() => setChatActive(false)}>
              X
            </div>
            <p>Chatting with: Bronx Chapter...</p>
          </div>
          <div className="chatMessages">
            {mockMessages.chat.messages.map((messageObject, index) => (
              <p key={index} className="chatMessage">
                <b>{messageObject.sent_by}</b>: {messageObject.message}
              </p>
            ))}
          </div>
          <ChatIcon
            sx={{ fontSize: '2em', color: '#fff' }}
            onClick={() => setChatActive(true)}
            className="chatIcon"
          />
          <form className="chatForm" onSubmit={handleSubmit}>
            <input
              type="text"
              className="userInput"
              placeholder="type your message..."
              onChange={(e) => setUserMessage(e.target.value)}
              value={userMessage}
              autoFocus={true}
            />
            <Button
              className="chatButton"
              variant="contained"
              sx={{ width: '50%', mt: '7px' }}
              type="submit"
            >
              Send
            </Button>
          </form>
        </>
      ) : (
        <>
          <div className="chatCloseAndChapter">
            <div className="chatClose" onClick={() => setChatActive(false)}>
              X
            </div>
            <p>Waiting to chat...</p>
          </div>
          <form className="guestForm" onSubmit={handleGuestSignup}>
            <label>Name</label>
            <input
              type="text"
              className="guestName"
              onChange={(e) =>
                setGuestInput({ ...guestInput, name: e.target.value })
              }
            />
            <label>Email</label>
            <input
              type="text"
              className="guestEmail"
              onChange={(e) =>
                setGuestInput({ ...guestInput, email: e.target.value })
              }
            />
            <Button
              className="chatButton"
              variant="contained"
              sx={{ width: '50%', mt: '7px' }}
              type="submit"
            >
              Send
            </Button>
          </form>
          <ChatIcon
            sx={{ fontSize: '2em', color: '#fff' }}
            onClick={() => setChatActive(true)}
            className="chatIcon"
          />
        </>
      )}
    </div>
  );
}
