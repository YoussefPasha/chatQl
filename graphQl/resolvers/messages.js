const { UserInputError, AuthenticationError } = require("apollo-server");

const { Message, User } = require("../../models");

module.exports = {
  Mutation: {
    sendMessage: async (parent, { to, content }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const recipient = await User.findOne({ where: { userName: to } });
        if (!recipient) {
          throw new UserInputError("User not found");
        } else if (recipient.userName === user.userName) {
          throw new UserInputError("You can't message yourself");
        }
        if (content.trim() === "") {
          throw new UserInputError("Message is empty");
        }
        const message = await Message.create({
          from: user.userName,
          to,
          content,
        });
        return message;
      } catch (error) {
        throw error;
      }
    },
  },
};
