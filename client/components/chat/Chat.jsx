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
} from '@apollo/client';
import { WebSocketLink } from 'apollo-link-ws';

// const link = new WebSocketLink({
//   uri: `ws://localhost:3000/`,
//   options: {
//     reconnect: true,
//   },
// });

// const client = new ApolloClient({
//   link,
//   uri: "http://localhost:3000/",
//   cache: new InMemoryCache(),
// });

// const GET_MESSAGES = gql`
//   subscription {
//     messages {
//       id
//       content
//       user
//     }
//   }
// `;

// const POST_MESSAGE = gql`
//   mutation($user: String!, $content: String!) {
//     postMessage(user: $user, content: $content)
//   }
// `;

export default function Chat() {
  //   const { data } = useSubscription(GET_MESSAGES);
  //   if (!data) {
  //     return null;
  //   }

  const {user} = useContext(UserContext);
  const [chatActive, setChatActive] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [chatUser, setChatUser] = useState({});
  const [guestInput, setGuestInput] = useState({
    name: '',
    email: '',
  });
  const [mockMessages, setMockMessages] = useState({
    data: {
      chat: {
        users: {
          first_name: 'Milos',
        },
        visitors: {
          first_name: 'Jonathan',
        },
        messages: [
          {
            created_at: '1650594668915',
            received_by: 'ff1a73a8-540e-4bce-a86f-899347d61c3e',
            sent_by: '123test@testemail.com',
            message: 'First Message',
          },
        ],
      },
    },
  });

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
    }
    if (!chatActive) chatButton.style.display = 'none';
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
      const newMessages = [
        {
          created_at: 'test',
          received_by: 'test',
          sent_by: chatUser.email,
          message: userMessage,
        },
        ...mockMessages.data.chat.messages,
      ];

      setMockMessages({
        data: {
          chat: {
            ...mockMessages.data.chat,
            messages: newMessages,
          },
        },
      });
      setUserMessage('');
    }
  };

  const handleGuestSignup = (e) => {
    e.preventDefault();

    if (guestInput.name !== '' && guestInput.email !== '') {
      setChatUser({ name: guestInput.name, email: guestInput.email });
    }
  };

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
            {mockMessages.data.chat.messages.map((messageObject, index) => (
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
