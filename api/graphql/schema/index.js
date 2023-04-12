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
  type Photos {
    data: [Photo!]
    total: Float!
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
  type Comments {
    data: [Comment!]
    total: Float!
  }
  type Error {
    message: String!
  }
  union AuthResponse = Auth | Error
  input UserInput {
    name: String!
    email: String!
    password: String!
  }
  input PostInput {
    imageUrl: String!
    caption: String!
  }
  input UpdatePostInput {
    photoId: ID!
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
    signin(email: String!, password: String!): AuthResponse!
    profile(userId: ID!): User!
    photos(isAuth: Boolean!, exclude: ID, skip: Float, limit: Float): Photos!
    userPhotos(userId: ID!, skip: Float, limit: Float): Photos!
    photo(photoId: ID!): Photo!
    comments(photoId: ID, skip: Float, limit: Float): Comments!
  }
  type RootMutation {
    signup(userInput: UserInput): AuthResponse!
    post(postInput: PostInput): Photo!
    updatePost(updatePostInput: UpdatePostInput): Photo!
    deletePost(photoId: ID!): Photo!
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
