const queryStrs = {
  login: `mutation login ($email: String!, $password: String!) {
      login (email: $email, password: $password) {
        user {
          first_name
          last_name
          email
          chapter_id
        }
        token
      }
    }`,
  addUser: `mutation addUser ($first_name: String!, $last_name: String!, $email: String!, $password: String!, $chapter_id: Int!) {
  addUser (first_name: $first_name, last_name: $last_name, email: $email, password: $password, chapter_id: $chapter_id) {
    first_name
        }
      }`,
};

module.exports = queryStrs;
