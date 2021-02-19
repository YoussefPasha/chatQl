const { ApolloServer, gql } = require("apollo-server");
const { sequelize } = require("./models");

const typeDefs = require("./graphQl/typeDefs");
const resolvers = require("./graphQl/resolvers");
const contextMiddleWare = require('./util/contextMiddleware')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleWare,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  sequelize
    .authenticate()
    .then(() => console.log("Database connected"))
    .catch((err) => console.error(err));
});
