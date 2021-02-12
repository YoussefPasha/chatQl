const { User } = require("../models");
const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (error) {
        console.error(error);
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
          throw new AuthenticationError("password is incorrect", { errors });
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
        //TODO: Validate input data
        if (email.trim() === "") errors.email = "Email must not be empty";
        if (password.trim() === "")
          errors.password = "Password must not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "Confirm Password must not be empty";
        if (userName.trim() === "")
          errors.userName = "Username must not be empty";

        //TODO: Check if userName / email exists
        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        //TODO: Check password and confirmation password
        if (password !== confirmPassword)
          errors.confirmPassword = "Passwords must match";

        //TODO: Hash password
        password = await bcrypt.hash(password, 6);

        //TODO: Create user
        const user = await User.create({
          userName,
          email,
          password,
        });

        //TODO: Return user
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
