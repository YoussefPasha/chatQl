const { UserInputError, AuthenticationError } = require("apollo-server");
const { Op } = require("sequelize");
const { Message, User } = require("../../models");

module.exports = {
  Query: {
    getMessages: async (parent, { from }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        const otherUser = await User.findOne({
          where: { userName: from },
        });
        if (!otherUser) throw new UserInputError("User not found");
        const userNames = [user.userName, otherUser.userName];

        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: userNames },
            to: { [Op.in]: userNames },
          },
          order: [["createdAt", "DESC"]],
        });
        return messages;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
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
