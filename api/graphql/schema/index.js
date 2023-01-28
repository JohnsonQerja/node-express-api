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
    photo: Photo
    comment: Comment
    user: User!
  }
  type Comment {
    _id: ID!
    message: String!
    photo: Photo!
    user: User!
    reply: [Comment!]
    likes: [Like!]
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
  input LikeInput {
    itemId: ID!
    type: String!
  }
  input CommentInput {
    threadId: ID!
    message: String!
  }
  type RootQuery {
    signin(email: String!, password: String!): Auth!
    profile(userId: ID!): User!
    photos: [Photo!]
    userPhotos(userId: ID!): [Photo!]
    photo(photoId: ID!): Photo!
  }
  type RootMutation {
    signup(userInput: UserInput): Auth!
    post(postInput: PostInput): Photo!
    like(likeInput: LikeInput): Like!
    dislike(likeInput: LikeInput): Like!
    postComment(commentInput: CommentInput): Comment!
    postReply(commentInput: CommentInput): Comment!
  }
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);
