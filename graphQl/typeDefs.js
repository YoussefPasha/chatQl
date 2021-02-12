const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    userName: String!
    email: String!
  }
  type Query {
    getUsers: [User]!
  }
  type Mutation {
    register(
      userName: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
  }
`;
