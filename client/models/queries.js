import { gql } from "@apollo/client";

const queries = {};

queries.login = gql`mutation login ($email: String!, $password: String!) {
      login (email: $email, password: $password) {
        user {
          first_name
          last_name
          email
          chapter_id
        }
        token
      }
    }`;

queries.addUser = gql`mutation addUser ($first_name: String!, $last_name: String!, $email: String!, $password: String!, $chapter_id: Int!) {
  addUser (first_name: $first_name, last_name: $last_name, email: $email, password: $password, chapter_id: $chapter_id) {
    first_name
        }
      }`;

queries.updateItem = gql`mutation updateItem ($item_id: Int!, $total_received: Int!, $chapter_id: Int!) {
            updateItem (item_id: $item_id, total_received: $total_received, chapter_id: $chapter_id) {
          items {
            id
            name
            total_received
          }
        }
      }`;

queries.getItems = gql`query items {
        items {
              id,
              name,
              total_needed,
              total_received,
              category
        }
      }`;

queries.addNeed = gql`mutation addNeed ($name: String!, $category: String!, $total_needed: Int!, $total_received: Int!) {
            addNeed (name: $name, category: $category, total_needed: $total_needed, total_received: $total_received) {
          id
          name
          total_needed
          total_received
        }
      }`;

queries.chapterItemsQuery = gql`query chapterItems ($id: Int!) {
          chapter (id: $id) {
            items {
              id,
              name,
              total_needed,
              total_received,
              category
            }
          }
        }`;

queries.allChapters = gql`query chapters {
        chapters {
          name
          id
          items {
            name
            category
            total_received
          }
        }
      }`;

queries.chapters = gql`query chaptersNames {
  chapters {
          name
          id
        }
}`;

queries.getOneChapter = gql`query chapterInfo ($id: Int!) {
  chapter (id: $id) {
          name
          street
          city
          state
          zip
          email
          phone
          id
          users {
            email
            first_name
            last_name
          }
          items {
            id
            name
            total_needed
            total_received
            category
          }
        }

}`;

queries.addChapter = gql`mutation addChapter ($name: String!, $street: String!, $city: String!, $state: String!, $zip: String!, $phone: String!, $email: String!, $longitude: Float!, $latitude: Float!) {
  addChapter (name: $name, street: $street, city: $city, state: $state, zip: $zip, phone: $phone, email: $email, longitude: $longitude, latitude: $latitude) {
    id
    name
        }
      }`;

queries.addVisitor = gql`mutation AddVisitor($email: String!, $firstName: String!) {
  addVisitor(email: $email, first_name: $firstName) {
    id
    email
    first_name
    chats {
      id
    }
  }
}`;

queries.postMessage = gql`
  mutation CreateMessage($message: String!, $sentBy: String!, $receivedBy: String!, $chatId: Int!) {
  createMessage(message: $message, sent_by: $sentBy, received_by: $receivedBy, chat_id: $chatId) {
    message
    chats {
      users {
        first_name
      }
      visitors {
        first_name
      }
      messages {
        id
        message
        sent_by
        received_by
        created_at
      }
    }
  }
}`;

queries.addVisitor = gql`
mutation AddVisitor($firstName: String!, $email: String!) {
  addVisitor(first_name: $firstName, email: $email) {
    id,
    first_name,
    email,
  }
}`;

queries.getChats = gql`
  query Chat($chatId: Int) {
  chat(id: $chatId) {
    id
    users {
      first_name
      email
    }
    visitors {
      id
      email
      first_name
    }
    messages {
      id
      message
      sent_by
      received_by
      created_at
    }
  }
}`;

queries.getMessages = gql`
  subscription NewMessage($id: Int!) {
  newMessage(id: $id) {
    id
    messages {
      id
      message
      sent_by
      received_by
      created_at
    }
    users {
      first_name
      email
      chapter_id
    }
    visitors {
      id
      email
      first_name
    }
  }
}
`;

export default queries;