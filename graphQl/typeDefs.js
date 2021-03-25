const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    userName: String!
    email: String
    createdAt: String!
    token: String
    latestMessage: Message
    imageUrl: String!
  }
  type Message {
    uuid: String!
    content: String!
    from: String!
    to: String!
    createdAt: String!
  }
  type Query {
    getUsers: [User]!
    login(userName: String!, password: String!): User!
    getMessages(from: String!): [Message]!
  }
  type Mutation {
    register(
      userName: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendMessage(to: String!, content: String!): Message!
  }
`;
