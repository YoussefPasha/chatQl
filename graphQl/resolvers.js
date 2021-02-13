const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { JWT_SECRET } = require("../config/env.json");

module.exports = {
  Query: {
    getUsers: async (_, __, context) => {
      try {
        let user;
        if (context.req && context.req.headers.authorization) {
          const token = context.req.headers.authorization.split("Bearer ")[1];
          jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if (err) {
              throw new AuthenticationError("Unauthenticated");
            }
            user = decodedToken;
          });
        }
        const users = await User.findAll({
          where: { userName: { [Op.ne]: user.userName } },
        });
        return users;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    login: async (_, args) => {
      const { userName, password } = args;
      let errors = {};
      try {
        if (userName.trim() === "") {
          errors.userName = "username must not be empty";
        }
        if (password.trim() === "") {
          errors.password = "password must not be empty";
        }
        if (Object.keys(errors).length > 0) {
          throw new UserInputError("bad request", { errors });
        }
        const user = await User.findOne({
          where: { userName },
        });
        if (!user) {
          errors.userName = "user not found";
          throw new UserInputError("user not found", { errors });
        }
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
          errors.password = "password is incorrect";
          throw new UserInputError("password is incorrect", { errors });
        }
        const token = jwt.sign(
          {
            userName,
          },
          JWT_SECRET,
          { expiresIn: 60 * 60 }
        );
        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { userName, email, password, confirmPassword } = args;
      let errors = {};
      try {
        if (email.trim() === "") errors.email = "Email must not be empty";
        if (password.trim() === "")
          errors.password = "Password must not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "Confirm Password must not be empty";
        if (userName.trim() === "")
          errors.userName = "Username must not be empty";

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        if (password !== confirmPassword)
          errors.confirmPassword = "Passwords must match";

        password = await bcrypt.hash(password, 6);

        const user = await User.create({
          userName,
          email,
          password,
        });

        return user;
      } catch (error) {
        console.error(error);
        if (error.name === "SequelizeUniqueConstraintError") {
          error.errors.forEach(
            (e) => (errors[e.path] = `${e.path.split(".")[1]} is already taken`)
          );
        } else if (error.name === "SequelizeValidationError") {
          error.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad request ", { errors });
      }
    },
  },
};
