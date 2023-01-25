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
  type Photo {
    _id: ID!
    imageUrl: String!
    caption: String!
    user: User!
    likes: [Like!]
    created_at: String!
  }
  type Like {
    _id: ID!
    photo: Photo!
    user: User!
  }
  input UserInput {
    name: String!
    email: String!
    password: String!
  }
  type RootQuery {
    signin(email: String!, password: String!): Auth!
    photos: [Photo!]
    userPhotos(userId: ID!): [Photo!]
    photo(photoId: ID!): Photo!
  }
  type RootMutation {
    signup(userInput: UserInput): User
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
