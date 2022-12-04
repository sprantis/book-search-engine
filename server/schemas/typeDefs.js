// Referencing code from Module 21
// Input Type reference: https://graphql.org/graphql-js/mutations-and-input-types/
const { gql } = require('apollo-server-express');

const typeDefs = gql`

  # input BookInput {
    # bookId: String!
    # authors: [String]
    # description: String!
    # title: String!
    # image: String
    # link: String
  # }

  # Define which fields are accessible from the User model
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  # Define which fields are accessible from the Book model
  type Book {
    #bookId: ID!
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  # Define which queries the front end is allowed to make and what data is returned
  # This is the entry point to our resolvers
  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    # saveBook(input: BookInput): User
    saveBook(bookId: ID!, authors: [String], description: String, title: String, image: String, link: String): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
