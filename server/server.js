// Referencing code from Module 21
// import express package
const express = require('express');
// Import the ApolloServer class
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { authMiddleware } = require('./utils/auth');

// Import the two parts of a GraphQL schema
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
// create ApolloServer instance and provide our typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// Create express instance
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// point to build if in production environment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // Add apolloserver to express app
  server.applyMiddleware({ app });
  
  // connect to database and start express ap
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
