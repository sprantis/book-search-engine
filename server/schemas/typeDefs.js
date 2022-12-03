// Referencing code from Module 21
// Input Type reference: https://graphql.org/graphql-js/mutations-and-input-types/
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  input BookInput {
    bookId: ID!
    authors: [String]
    title: String
    description: String
    image: String
    link: String
  }

  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(input: BookInput!): User
    removeBook(bookId: ID!): User
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
