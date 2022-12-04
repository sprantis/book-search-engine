// Referencing code from Module 21
const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        // const user = await User.findOne({_id: context.use._id})
        
        // // await User.findOne({ _id: context.user._id }).select('-__v -password').populate('savedBooks');

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
    saveBook: async (parent, { input }, context) => {
    //   console.log(context);
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { savedBooks: input } },
            { new: true }
        )

        return updatedUser;
        // return User.findOneAndUpdate(
        //     {_id: context.user._id }, 
        //     { $addToSet: { savedBooks: input } },
        //     {
        //         new: true,
        //         runValidators: true
        //     }
        // );
      }

      throw new AuthenticationError('Not logged in');
    },
    removeBook: async (parent, { bookId }, context) => {
        // console.log(context);
        if (context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId } } },
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
