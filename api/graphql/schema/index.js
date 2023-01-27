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
    comments: [Comment!]
    created_at: String!
  }
  type Like {
    _id: ID!
    photo: Photo!
    user: User!
  }
  type Comment {
    _id: ID!
    message: String!
    photo: Photo!
    user: User!
    reply: [Comment!]
  }
  input UserInput {
    name: String!
    email: String!
    password: String!
  }
  input PostInput {
    imageUrl: String!
    caption: String!
  }
  input CommentInput {
    threadId: ID!
    message: String!
  }
  type RootQuery {
    signin(email: String!, password: String!): Auth!
    photos: [Photo!]
    userPhotos(userId: ID!): [Photo!]
    photo(photoId: ID!): Photo!
  }
  type RootMutation {
    signup(userInput: UserInput): Auth!
    post(postInput: PostInput): Photo!
    like(photoId: ID!): Like!
    unlike(likeId: ID!): Like!
    postComment(commentInput: CommentInput): Comment!
    postReply(commentInput: CommentInput): Comment!
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
