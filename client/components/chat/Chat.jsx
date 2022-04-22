import React, { useEffect, useState, useRef } from "react";
import "./chat.css";
import ChatIcon from "@mui/icons-material/Chat";
import Button from "@mui/material/Button";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useSubscription,
  useMutation,
  gql,
} from "@apollo/client";
import { WebSocketLink } from "apollo-link-ws";

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

  const [chatActive, setChatActive] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [mockMessages, setMockMessages] = useState([
    {
      author: "michael",
      message: "This is a test message",
    },
    {
      author: "Bronx chapter",
      message: "This is a test response",
    },
    {
      author: "michael",
      message: "This is yet another message",
    },
  ]);
  const [guest, setGuest] = useState({});

  useEffect(() => {
    const chat = document.querySelector(".chat");
    const chatCloseAndChapter = document.querySelector(".chatCloseAndChapter");
    const chatMessages = document.querySelector(".chatMessages");
    const userInput = document.querySelector(".userInput");
    const chatIcon = document.querySelector(".chatIcon");
    const chatButton = document.querySelector(".chatButton");
    const guestForm = document.querySelector(".guestForm");

    if (!chatActive) {
      if (guest.name) {
        chatMessages.classList.remove("active");
        userInput.classList.remove("active");
        chatButton.style.display = "none";
      } else {
        guestForm.classList.remove("active");
      }
      chatCloseAndChapter.classList.remove("active");
      chatIcon.style.display = "block";
      chat.classList.remove("active");
    } else {
      if (guest.name) {
        chatMessages.classList.add("active");
        userInput.classList.add("active");
        chatButton.style.display = "block";
      } else {
        guestForm.classList.add("active");
      }
      chatCloseAndChapter.classList.add("active");
      chatIcon.style.display = "none";
      chat.classList.add("active");
    }
  }, [chatActive]);

  useEffect(() => {
    // look for cookie and use setGuest to change state
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userMessage !== "") {
      setMockMessages([
        { author: "michael", message: userMessage },
        ...mockMessages,
      ]);
      setUserMessage("");
    }
  };

  return (
    <div className="chat">
      {guest.name ? (
        <>
          <div className="chatCloseAndChapter">
            <div className="chatClose" onClick={() => setChatActive(false)}>
              X
            </div>
            <p>Chatting with: Bronx Chapter...</p>
          </div>
          <div className="chatMessages">
            {mockMessages.map((messageObject, index) => (
              <p key={index} className="chatMessage">
                <b>{messageObject.author}</b>: {messageObject.message}
              </p>
            ))}
          </div>
          <ChatIcon
            sx={{ fontSize: "2em", color: "#fff" }}
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
              sx={{ width: "50%", mt: "7px" }}
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
          <form className="guestForm">
            <p>Please enter your information to begin chatting...</p>
            <label>Name</label>
            <input type="text" className="guestName" />
            <label>Email</label>
            <input type="text" className="guestEmail" />
            <Button
              className="chatButton"
              variant="contained"
              sx={{ width: "50%", mt: "7px" }}
              type="submit"
            >
              Send
            </Button>
          </form>
          <ChatIcon
            sx={{ fontSize: "2em", color: "#fff" }}
            onClick={() => setChatActive(true)}
            className="chatIcon"
          />
        </>
      )}
    </div>
  );
}
