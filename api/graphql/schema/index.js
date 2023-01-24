const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
  }
  type Auth {
    _id: ID!
    name: String!
    email: String!
    token: String!
  }
  input UserInput {
    name: String!
    email: String!
    password: String!
  }
  type RootQuery {
    signin(email: String!, password: String!): Auth!
  }
  type RootMutation {
    signup(userInput: UserInput): User
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
