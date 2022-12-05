// Referencing code from Module 21
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');
const { isCompositeType } = require('graphql');

// Create the functions that fulfill the queries defined in `typeDefs.js`
const resolvers = {
  Query: {
    // context parameter should ALWAYS be the third parameter
    me: async (parent, args, context) => {
        // Get and return all documents from the me collection
        if (context.user) {
            // const user = await User.findOne({_id: context.user._id}).populate('savedBooks');
            
            // await User.findOne({ _id: context.user._id }).select('-__v -password').populate('savedBooks');

            // return user;
            return User.findOne({ _id: context.user._id }).populate('savedBooks');
        }

        throw new AuthenticationError('Not logged in');
    },
  },
  Mutation: {
    addUser: async (parent, {username, email, password }) => {
      const user = await User.create({username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError('No user found with this email address');
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const token = signToken(user);
  
        return { token, user };
    },
    saveBook: async (parent, { bookId, authors, description, title, image, link }, context) => {
        console.dir(context);
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks:  { bookId, authors, description, title, image, link } } },
            { new: true }
        );  
        return updatedUser;
      }

      throw new AuthenticationError('Not logged in');
    },
    removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
            );
  
            return updatedUser;
        }
        // return User.findOneAndUpdate(
        //     { _id: context.user._id },
        //     { $pull: { savedBooks: { bookId } } },
        //     { new: true }
        // );
  
        throw new AuthenticationError('Not logged in');
    }
  }
};

module.exports = resolvers;
